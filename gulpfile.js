// Initialize modules
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const replace = require("gulp-replace");
const htmlMin = require("gulp-htmlmin");
const purgecss = require("gulp-purgecss");
const fileOrder = require("gulp-order");
const browsersync = require("browser-sync").create();

// File paths
const files = {
  scssPath: "./scss/**/*.scss",
  vendorPath: "./vendor/**/*.js",
  jsPath: "./js/**/*.js",
};

const filesMove = [
  "images/**/*.*",
  "fonts/**/*.*",
  "videos/**/*.*", // Add any additional folders to move to dist
];

const nonBundledJsFiles = [
  "js/jquery.js",
  "js/jquery-migrate.js",
  "js/main.js",
];

// Sass task: compiles SCSS to CSS
function scssTask() {
  return src(files.scssPath, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer("last 2 versions"), cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// Purging CSS from dist folder
function purgingTask() {
  return src("./dist/css/*.css")
    .pipe(
      purgecss({
        content: ["./dist/*.html"],
      })
    )
    .pipe(dest("./dist/css/purged"));
}

// Moving files to dist folder
function movingTask() {
  return src(filesMove, { base: "./" }).pipe(dest("dist"));
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(files.vendorPath, { sourcemaps: true })
    .pipe(
      fileOrder(
        [
          "vendor/bootstrap.bundle.js",
          "vendor/lenis.js",
          "vendor/gsap.js",
          "vendor/ScrollTrigger.js",
          "vendor/swiper-bundle.js",
          "vendor/fancybox.umd.js",
          "vendor/aos.js",
        ],
        { base: "./" }
      )
    )
    .pipe(concat("vendor.js"))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// Move non-bundled JS files to dist/js without bundling
function moveNonBundledJsTask() {
  return src(nonBundledJsFiles, { base: "./" }).pipe(dest("dist"));
}

// Cachebust
function cacheBustTask() {
  var cbString = new Date().getTime();
  return src("./*.html")
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      })
    )
    .pipe(dest("dist"));
}

// Browsersync to spin up a local server
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task: watch SCSS and JS files for changes
function watchTask() {
  watch(
    [files.scssPath, files.jsPath, files.vendorPath],
    { interval: 1000, usePolling: true },
    series(parallel(scssTask, jsTask, moveNonBundledJsTask), cacheBustTask)
  );
}

// Browsersync Watch task
function bsWatchTask() {
  watch("./*.html", browserSyncReload);
  watch(
    [files.scssPath, files.jsPath, files.vendorPath],
    { interval: 1000, usePolling: true },
    series(
      parallel(scssTask, jsTask, moveNonBundledJsTask),
      cacheBustTask,
      purgingTask,
      movingTask,
      browserSyncReload
    )
  );
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask, moveNonBundledJsTask),
  cacheBustTask,
  purgingTask,
  movingTask,
  watchTask
);

// Browsersync-enabled task
exports.bs = series(
  parallel(scssTask, jsTask, moveNonBundledJsTask),
  cacheBustTask,
  purgingTask,
  movingTask,
  browserSyncServe,
  bsWatchTask
);
