(function ($) {
  "use strict";

  /* ----------------------------------------------------------- */
  /*  FUNCTION TO STOP LOCAL AND YOUTUBE VIDEOS IN SLIDESHOW     */
  /* ----------------------------------------------------------- */
  function stop_videos() {
    var video = document.getElementById("video");
    if (video && video.paused !== true && video.ended !== true) {
      video.pause();
    }
    if ($(".youtube-video")[0]) {
      $(".youtube-video")[0].contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
  }

  $(window).on("load", function () {
    /* ----------------------------------------------------------- */
    /*  PAGE PRELOADER         */
    /* ----------------------------------------------------------- */
    var preloader = $("#preloader");
    setTimeout(function () {
      preloader.addClass("preloaded");
    }, 800);
  });

  $(document).ready(function () {
    /* ----------------------------------------------------------- */
    /*  STOP VIDEOS         */
    /* ----------------------------------------------------------- */
    $(".slideshow nav span").on("click", function () {
      stop_videos();
    });

    /* ----------------------------------------------------------- */
    /*  MOBILE MENU 		*/
    /* ----------------------------------------------------------- */
    // Toggle mobile menu
    $("#trigger-mobile").on("click", function () {
      $(this).toggleClass("show-menu"); // animate hamburger to X
      $("#mobile-nav").toggleClass("show-list"); // slide menu in/out
    });

    // Smooth scroll + close menu on link click
    $("#mobile-nav li").on("click", function (e) {
      e.preventDefault();

      // Active link on click
      $("#mobile-nav li").removeClass("active");
      $(this).addClass("active");

      // Smooth scroll
      var targetId = $(this).find("span").text().toLowerCase();
      var targetElement = $("#" + targetId);
      if (targetElement.length) {
        $("html, body").animate(
          { scrollTop: targetElement.offset().top - 50 },
          600
        );
      }

      // Close mobile menu after click
      $("#mobile-nav").removeClass("show-list");
      $("#trigger-mobile").removeClass("show-menu");
    });

    // Scroll spy for active class
    $(window).on("scroll", function () {
      var scrollPos = $(document).scrollTop();

      $("section").each(function () {
        var sectionTop = $(this).offset().top - 60;
        var sectionBottom = sectionTop + $(this).outerHeight();
        var sectionId = $(this).attr("id");

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          $("#mobile-nav li").removeClass("active");
          $("#mobile-nav li")
            .filter(function () {
              return $(this).find("span").text().toLowerCase() === sectionId;
            })
            .addClass("active");
        }
      });
    });

    /* ----------------------------------------------------------- */
    /*  DESKTOP MENU (Click to scroll) */
    /* ----------------------------------------------------------- */
    // ------ config
    var SCROLL_OFFSET = 50; // adjust for your fixed header height
    var isAnimatingScroll = false;

    // ------ CLICK: smooth scroll + set active immediately
    $("#desktop-nav li").on("click", function (e) {
      e.preventDefault();

      var $item = $(this);
      var targetId = $item.find("h2").text().trim().toLowerCase(); // "home", "about", etc.
      var $target = $("#" + targetId);

      if ($target.length) {
        // mark active right away
        $("#desktop-nav li").removeClass("active");
        $item.addClass("active");

        isAnimatingScroll = true;
        $("html, body")
          .stop()
          .animate(
            { scrollTop: $target.offset().top - SCROLL_OFFSET },
            600,
            function () {
              // allow scroll spy to resume after animation completes
              isAnimatingScroll = false;
            }
          );
      }
    });

    // ------ SCROLL SPY: update active while scrolling
    // Build a jQuery collection of only the sections that appear in the desktop nav
    var sectionIds = $("#desktop-nav li")
      .map(function () {
        return $(this).find("h2").text().trim().toLowerCase();
      })
      .get();

    var $sections = $(
      sectionIds
        .map(function (id) {
          return "#" + id;
        })
        .join(",")
    );

    $(window).on("scroll", function () {
      if (isAnimatingScroll) return; // ignore while smooth scrolling

      var scrollPos = $(document).scrollTop() + SCROLL_OFFSET + 1; // +1 handles boundary cases
      var currentId = null;

      $sections.each(function () {
        var $sec = $(this);
        var top = $sec.offset().top;
        var bottom = top + $sec.outerHeight();
        if (scrollPos >= top && scrollPos < bottom) {
          currentId = this.id;
          return false; // break
        }
      });

      if (currentId) {
        $("#desktop-nav li").removeClass("active");
        $("#desktop-nav li")
          .filter(function () {
            return $(this).find("h2").text().trim().toLowerCase() === currentId;
          })
          .addClass("active");
      }
    });

    // Set the correct item as active on initial load/refresh
    $(function () {
      $(window).trigger("scroll");
    });

    /* ----------------------------------------------------------- */
    /*  PORTFOLIO GALLERY */
    /* ----------------------------------------------------------- */
    if ($(".gridlist").length) {
      new CBPGridGallery(document.getElementById("grid-gallery"));
    }

    /* ----------------------------------------------------------- */
    /*  HIDE HEADER WHEN PORTFOLIO SLIDESHOW OPENED */
    /* ----------------------------------------------------------- */
    $(".gridlist figure").on("click", function () {
      $("#navbar-collapse-toggle").addClass("hide-header");
      if ($(window).width() < 992) {
        $("#trigger-mobile").addClass("hide-trigger");
      }
    });

    /* ----------------------------------------------------------- */
    /*  SHOW HEADER WHEN PORTFOLIO SLIDESHOW CLOSED */
    /* ----------------------------------------------------------- */
    $(".nav-close").on("click", function () {
      $("#navbar-collapse-toggle").removeClass("hide-header");
      $("#trigger-mobile").removeClass("hide-trigger");
    });
    $(".nav-prev").on("click", function () {
      if ($(".slideshow ul li:first-child").hasClass("current")) {
        $("#navbar-collapse-toggle").removeClass("hide-header");
        $("#trigger-mobile").removeClass("hide-trigger");
      }
    });
    $(".nav-next").on("click", function () {
      if ($(".slideshow ul li:last-child").hasClass("current")) {
        $("#navbar-collapse-toggle").removeClass("hide-header");
        $("#trigger-mobile").removeClass("hide-trigger");
      }
    });

    /* ----------------------------------------------------------- */
    /*  PORTFOLIO DIRECTION AWARE HOVER EFFECT */
    /* ----------------------------------------------------------- */
    var item = $(".gridlist li figure");
    var elementsLength = item.length;
    for (var i = 0; i < elementsLength; i++) {
      if ($(window).width() > 991) {
        $(item[i]).hoverdir();
      }
    }

    /* ----------------------------------------------------------- */
    /*  AJAX CONTACT FORM */
    /* ----------------------------------------------------------- */
    $("#contactform").on("submit", function () {
      $("#message").text("Sending...");
      var form = $(this);
      $.ajax({
        url: form.attr("action"),
        method: form.attr("method"),
        data: form.serialize(),
        success: function (result) {
          if (result === "success") {
            $("#contactform").find(".output_message").addClass("success");
            $("#message").text("Message Sent!");
          } else {
            $("#contactform").find(".output_message").addClass("error");
            $("#message").text("Error Sending!");
          }
        },
      });
      return false;
    });

    /* ----------------------------------------------------------- */
    /*  SCROLL SPY - Highlight active menu item while scrolling */
    /* ----------------------------------------------------------- */
    var sections = $("section[id]");
    var navItems = $("#desktop-nav li");

    $(window).on("scroll", function () {
      var scrollPos = $(document).scrollTop() + 60; // adjust for offset
      sections.each(function () {
        var top = $(this).offset().top;
        var bottom = top + $(this).outerHeight();
        if (scrollPos >= top && scrollPos <= bottom) {
          var id = $(this).attr("id");
          navItems.removeClass("active");
          $("#desktop-nav li")
            .filter(function () {
              return $(this).find("h2").text().toLowerCase() === id;
            })
            .addClass("active");
        }
      });
    });
  });

  $(document).keyup(function (e) {
    /* ----------------------------------------------------------- */
    /*  KEYBOARD NAVIGATION IN PORTFOLIO SLIDESHOW */
    /* ----------------------------------------------------------- */
    if (e.keyCode === 27) {
      stop_videos();
      $(".close-content").click();
      $("#navbar-collapse-toggle").removeClass("hide-header");
    }
    if (e.keyCode === 37 || e.keyCode === 39) {
      stop_videos();
    }
  });
})(jQuery);
