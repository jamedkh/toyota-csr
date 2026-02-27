jQuery(document).ready(function ($) {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis({
    duration: 2, // scroll duration in seconds (default is 1.2)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // custom easing function
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1500); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  // footer full year
  const fullYear = new Date().getFullYear();
  const fullYearElement = document.querySelector(".fullYear");

  if (fullYearElement) {
    fullYearElement.textContent = fullYear;
  }

  $(document).on("scroll", onScroll);

  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });

  // search button click
  $(".searchClick").on("click", function (e) {
    e.preventDefault();
    $(".search_holder").toggleClass("open");
    $(".search_holder").parent().toggleClass("overflow-hidden");
    $(".search_holder .form-control").focus();
  });

  $(".searchOffClick").on("click", function (e) {
    e.preventDefault();
    $(".search_holder").removeClass("open");
    $(".search_holder").parent().removeClass("overflow-hidden");
  });

  // blank click function for ios
  $("a, .btn_outline, .btn_fill").click(function () {});

  // desktop menu
  /* 
  $(".lg_menu ul > li:has(ul)").addClass("has-sub");
  $(".lg_menu ul > li > a").hover(function () {
    $(".lg_menu ul > li").removeClass("active");
    $(this).closest("li").addClass("active");
  }); 
  */

  if ($(".filter_overaly_trigger").length) {
    $(".filter_overaly_trigger").on("click", function (e) {
      e.preventDefault();

      $(this).toggleClass("active");
      $(".overlay_content_holder").toggleClass("show-menu");
      $(".overlay_filter").toggleClass("active");
      $("html, body").toggleClass("overflow-hidden");

      // Control Lenis scroll
      if ($(".overlay_filter").hasClass("active")) {
        lenis.stop(); // Disable Lenis (stop smooth scroll)
      } else {
        lenis.start(); // Enable Lenis (resume smooth scroll)
      }
    });
  }

  // back to top
  const btnTop = document.querySelector("#btnTop");
  if (btnTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        btnTop.classList.add("activate");
      } else {
        btnTop.classList.remove("activate");
      }
    });

    btnTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // AOS dynamic for intro contents
  const introContents = document.querySelectorAll(".section_intro_content");
  if (introContents) {
    introContents.forEach((section) => {
      const paragraphs = section.querySelectorAll("p");
      paragraphs.forEach((p, idx) => {
        p.setAttribute("data-aos", "fade-up");
        if (paragraphs.length > 1) {
          p.setAttribute("data-aos-delay", (idx * 200).toString());
        } else {
          p.removeAttribute("data-aos-delay");
        }
      });
    });

    AOS.refresh();
  }

  const solutionIntro = document.querySelector(".solution_intro");
  if (solutionIntro) {
    const paragraphs = solutionIntro.querySelectorAll("p");
    paragraphs.forEach((p, idx) => {
      p.setAttribute("data-aos", "fade-up");
      p.setAttribute("data-aos-delay", (idx * 200).toString());
      if (idx === 0) {
        p.classList.add("h4");
      } else {
        p.classList.remove("h4");
      }
    });
    AOS.refresh();
  }

  const tabs = document.querySelectorAll(".accordion_tab");
  const labels = document.querySelectorAll(".accordion_label");

  // Update the height of the container
  function updateContainerHeight() {
    const activeItem = document.querySelector(".accordion_item.active");
    if (activeItem) {
      const container = activeItem.querySelector(".accordion_container");
      container.style.height = container.scrollHeight + "px";
    }
  }

  // Toggle event handler function
  function toggleShow() {
    const target = this;
    const item = target.closest("[data-actab-group]");
    const group = item.dataset.actabGroup;
    const id = item.dataset.actabId;

    // Toggle tabs
    document
      .querySelectorAll(`.accordion_tab[data-actab-group="${group}"]`)
      .forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.actabId === id);
      });

    // Toggle accordion items
    document
      .querySelectorAll(`.accordion_item[data-actab-group="${group}"]`)
      .forEach((item) => {
        const isActive = item.dataset.actabId === id;
        item.classList.toggle("active", isActive);
        const container = item.querySelector(".accordion_container");

        if (isActive) {
          container.style.height = container.scrollHeight + "px";
        } else {
          container.style.height = 0;
        }
      });
  }

  // Events to tabs and labels
  tabs.forEach((tab) => tab.addEventListener("click", toggleShow));
  labels.forEach((label) => label.addEventListener("click", toggleShow));

  // Resize event to update height
  window.addEventListener("resize", updateContainerHeight);

  // JavaScript for '----------(leadership_section)------- START HERE'
  (function () {
    const children = document.querySelectorAll(".leadership_section .child");
    const detail = document.querySelector(".leadership_section .detail");
    const detailContent = document.querySelector(
      ".leadership_section .detail-content"
    );
    const closeBtn = document.querySelector(".leadership_section .close-btn");
    const row = document.querySelector(".leadership_section .row");

    // Ensure all elements exist before proceeding
    if (!children.length || !detail || !detailContent || !closeBtn || !row) {
      // console.error("One or more elements are missing in the DOM.");
      return; // Exit if elements are missing
    }

    function updateDetailPosition(clickedChild) {
      const childTop = clickedChild.offsetTop;
      detail.style.transition = "none";
      detail.style.top = `${childTop}px`;
      requestAnimationFrame(() => {
        detail.style.transition = "right 0.3s ease";
      });
    }

    function updateDetailHeight(clickedChild) {
      const childHeight = clickedChild.offsetHeight;
      const gap = parseFloat(getComputedStyle(row).gap) || 0;
      detail.style.height = `${childHeight + gap}px`;
    }

    function showDetail(
      content,
      detailtitle,
      detailImg,
      clickedChild,
      positiontitle
    ) {
      updateDetailPosition(clickedChild);
      updateDetailHeight(clickedChild);
      detail.classList.remove("active");
      setTimeout(() => {
        detailContent.innerHTML = `
                <figure>
                    <img src="${detailImg}" />
                </figure>
                <article>
                    <h2>${detailtitle}</h2>
                    <h3>${positiontitle}</h3>
                    <div class="content-para" data-lenis-prevent>
                        <p>${content}</p>
                    </div>
                </article>`;
        detail.classList.add("active");
      }, 10);
    }

    children.forEach((child) => {
      child.addEventListener("click", function () {
        const childId = child.getAttribute("data-id");
        const detailTextArea = document.querySelector(
          `#data-detail-${childId}`
        );
        const detailText = detailTextArea
          ? detailTextArea.value
          : "No content available";
        const detailtitle = child.getAttribute("data-title");
        const detailImg = child.getAttribute("data-img");
        const positiontitle = child.getAttribute("data-position");
        showDetail(detailText, detailtitle, detailImg, child, positiontitle);
      });
    });

    closeBtn.addEventListener("click", function () {
      detail.classList.remove("active");
    });

    window.addEventListener("resize", function () {
      const activeChild = document.querySelector(
        ".leadership_section .child.active"
      );
      if (activeChild) {
        updateDetailPosition(activeChild);
        updateDetailHeight(activeChild);
      }
    });
  })();

  // JavaScript for '----------(leadership_section)------- START END HERE'

  // JavaScript for '----------(bod_section)------- START HERE'
  (function () {
    const bodChildren = document.querySelectorAll(".bod_section .bodCol");
    const bodDetail = document.querySelector(".bod_section .detail");
    const bodDetailContent = document.querySelector(
      ".bod_section .detail-content"
    );
    const closeBtn = document.querySelector(".bod_section .close-btn");
    const row = document.querySelector(".bod_section .row");

    // Ensure all elements exist before proceeding
    if (
      !bodChildren.length ||
      !bodDetail ||
      !bodDetailContent ||
      !closeBtn ||
      !row
    ) {
      // console.error("One or more elements are missing in the DOM.");
      return; // Exit if elements are missing
    }

    function updatebodDetailPosition(clickedChild) {
      const childTop = clickedChild.offsetTop;
      bodDetail.style.transition = "none";
      bodDetail.style.top = `${childTop}px`;
      requestAnimationFrame(() => {
        bodDetail.style.transition = "right 0.3s ease";
      });
    }

    function updatebodDetailHeight(clickedChild) {
      const childHeight = clickedChild.offsetHeight;
      const gap = parseFloat(getComputedStyle(row).gap) || 0;
      // bodDetail.style.height = `${childHeight + gap}px`;
    }

    function showbodDetail(
      content,
      bodDetailtitle,
      // bodDetailImg,
      clickedChild,
      bodPosition
    ) {
      updatebodDetailPosition(clickedChild);
      updatebodDetailHeight(clickedChild);
      bodDetail.classList.remove("active");
      setTimeout(() => {
        bodDetailContent.innerHTML = `
                <article >
                    <h2>${bodDetailtitle}</h2>
                    <h3>${bodPosition}</h3>
                    <div class="content-para" data-lenis-prevent>
                        <p>${content}</p>
                    </div>
                </article>`;
        bodDetail.classList.add("active");
      }, 10);
    }

    bodChildren.forEach((child) => {
      child.addEventListener("click", function () {
        const childId = child.getAttribute("data-id");
        const bodDetailTextArea = document.querySelector(
          `#data-bodDetail-${childId}`
        );
        const bodDetailText = bodDetailTextArea
          ? bodDetailTextArea.value
          : "No content available";
        const bodDetailtitle = child.getAttribute("data-title");
        // const bodDetailImg = child.getAttribute("data-img");
        const bodPosition = child.getAttribute("data-position");
        showbodDetail(
          bodDetailText,
          bodDetailtitle,
          // bodDetailImg,
          child,
          bodPosition
        );
      });
    });

    closeBtn.addEventListener("click", function () {
      bodDetail.classList.remove("active");
    });

    window.addEventListener("resize", function () {
      const activeChild = document.querySelector(".bod_section .bodCol.active");
      if (activeChild) {
        updatebodDetailPosition(activeChild);
        updatebodDetailHeight(activeChild);
      }
    });
  })();
  // JavaScript for '----------(bod_section)------- START END HERE'

  // JavaScript for '----------(Subsidiaries)------- START HERE'
  (function () {
    const subChildren = document.querySelectorAll(
      ".subsidiaries_section .subCol"
    );
    const subDetail = document.querySelector(".subsidiaries_section .detail");
    const subDetailContent = document.querySelector(
      ".subsidiaries_section .detail-content"
    );
    const closeBtn = document.querySelector(".subsidiaries_section .close-btn");
    const row = document.querySelector(".subsidiaries_section .row");

    // Ensure all elements exist before proceeding
    if (
      !subChildren.length ||
      !subDetail ||
      !subDetailContent ||
      !closeBtn ||
      !row
    ) {
      // console.error("One or more elements are missing in the DOM.");
      return; // Exit if elements are missing
    }

    function updateSubDetailPosition(clickedChild) {
      const childTop = clickedChild.offsetTop;
      subDetail.style.transition = "none";
      subDetail.style.top = `${childTop}px`;
      requestAnimationFrame(() => {
        subDetail.style.transition = "right 0.3s ease";
      });
    }

    function updateSubDetailHeight(clickedChild) {
      const childHeight = clickedChild.offsetHeight;
      const gap = parseFloat(getComputedStyle(row).gap) || 0;
      // subDetail.style.height = `${childHeight + gap}px`;
    }

    function showSubDetail(content, subDetailtitle, clickedChild) {
      updateSubDetailPosition(clickedChild);
      updateSubDetailHeight(clickedChild);
      subDetail.classList.remove("active");
      setTimeout(() => {
        subDetailContent.innerHTML = `
          <article>
            <h2>${subDetailtitle}</h2>
            <div class="content-para" data-lenis-prevent>
              ${content}
            </div>
          </article>`;
        subDetail.classList.add("active");
      }, 10);
    }

    subChildren.forEach((child) => {
      child.addEventListener("click", function () {
        const childId = child.getAttribute("data-id");
        const subDetailDiv = document.querySelector(
          `#data-subDetail-${childId}`
        );
        const subDetailText =
          subDetailDiv && subDetailDiv.innerHTML.trim()
            ? subDetailDiv.innerHTML.trim()
            : "No data is available";
        const subDetailtitle = child.getAttribute("data-title");
        showSubDetail(subDetailText, subDetailtitle, child);
      });
    });

    closeBtn.addEventListener("click", function () {
      subDetail.classList.remove("active");
    });

    window.addEventListener("resize", function () {
      const activeChild = document.querySelector(
        ".subsidiaries_section .subCol.active"
      );
      if (activeChild) {
        updateSubDetailPosition(activeChild);
        updateSubDetailHeight(activeChild);
      }
    });
  })();
  // JavaScript for '----------(Subsidiaries)------- START END HERE'

  const partnersSwiper = document.querySelector(".partners_swiper");
  if (partnersSwiper) {
    new Swiper(partnersSwiper, {
      autoplay: {
        delay: 2500,
      },
      loop: true,
      navigation: {
        nextEl: ".partner_next",
        prevEl: ".partner_prev",
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 1.8,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 40,
        },

        767: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },

      /*
       */
    });
  }

  const testimonialsSwiper = document.querySelector(".testimonials_swiper");
  if (testimonialsSwiper) {
    new Swiper(testimonialsSwiper, {
      loop: true,
      spaceBetween: 40,
      navigation: {
        nextEl: ".testimonial_next",
        prevEl: ".testimonial_prev",
      },

      /*
      autoplay: {
        delay: 2500,
      },
       */
    });
  }

  const highlightSwiper = document.querySelector(".highlight_swiper");
  if (highlightSwiper) {
    new Swiper(highlightSwiper, {
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 1.8,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 40,
        },

        767: {
          slidesPerView: 3,
          spaceBetween: 30,

          pagination: {
            el: ".highlight_swiper_pagination",
            type: "progressbar",
          },
          navigation: {
            nextEl: ".who-next",
            prevEl: ".who-prev",
          },
        },
      },
    });
  }

  // footer accordion
  if ($(window).width() < 575) {
    $(document).on("click", ".footer_single > h5", function () {
      $(this).toggleClass("active");
      $(this).next().slideToggle();
    });
  }

  if ($(window).width() < 1199) {
    $(".sm_menu li:has(> ul)").addClass("has-sub");

    // 2. Initially hide all sub-menus
    $(".sm_menu .has-sub ul").hide();

    // 3. Set up the click event handler
    $(".sm_menu .has-sub > a").on("click", function (e) {
      // Prevent the link from navigating if it has a sub-menu
      e.preventDefault();

      // The LI parent of the link you clicked
      let $parentLi = $(this).parent("li");

      // The sub-menu associated with the link you clicked
      let $subMenu = $(this).next("ul");

      // --- The Core Logic ---

      // A. Close other open menus that are SIBLINGS of the current LI
      // This prevents parent menus from being closed.
      $parentLi
        .siblings(".active")
        .removeClass("active")
        .children("ul")
        .slideUp(300);

      // B. Toggle the current sub-menu and its 'active' state
      $parentLi.toggleClass("active");
      $subMenu.slideToggle(300);
    });

    $(".sm_menu a").on("click", function (e) {
      var href = $(this).attr("href");
      if (!href) return;

      // Check if the link contains a hash
      var hashIndex = href.indexOf("#");
      if (hashIndex !== -1) {
        var pagePath = href.substring(0, hashIndex);
        var hash = href.substring(hashIndex);

        // If the link is for the current page (or no page specified)
        var isSamePage =
          pagePath === "" ||
          window.location.pathname.endsWith(pagePath) ||
          window.location.pathname.indexOf(pagePath) !== -1;

        // If the target section exists on the page
        if (isSamePage && $(hash).length) {
          // Close the mobile menu and overlay
          // $(".sm_menu").removeClass("active");
          $(".content_overlay_wrapper").removeClass("active");
          $(".filter_overaly_trigger").removeClass("active");
          $("body, html").removeClass("overflow-hidden");

          // Re-enable Lenis smooth scroll
          if (typeof lenis !== "undefined") {
            lenis.start();
          }
        }
      }
    });
  }

  AOS.init({
    duration: 1200,
    offset: 300,
    once: true,
  });
});

// viewport function
function viewport() {
  var e = window,
    a = "inner";

  if (!("innerWidth" in window)) {
    a = "client";
    e = document.documentElement || document.body;
  }

  return { width: e[a + "Width"], height: e[a + "Height"] };
}

function onScroll(event) {
  var scrollPos = $(document).scrollTop();
  $(".product_scroll_links a").each(function () {
    var currLink = $(this);
    var refElement = $(currLink.attr("href"));
    if (
      refElement.position().top <= scrollPos &&
      refElement.position().top + refElement.height() > scrollPos
    ) {
      $(".product_scroll_links ul li").removeClass("current");
      currLink.parent().addClass("current");
      $(".product_scroll_links .intro_prd").text(currLink.text()); //set text
    } else {
      currLink.parent().removeClass("current");
      // currLink.removeClass("current");
    }
  });
}
