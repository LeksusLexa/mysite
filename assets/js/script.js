/*
  Template Name: Rokon - Single Product eCommerce HTML Template
  Author Name: Hook theme
  Author URL: https://themeforest.net/user/hooktheme
  Version: 1.0.0
*/

"use strict";

// Preloader
const preLoader = function () {
  let preloaderWrapper = document.getElementById("preloader");
  window.onload = () => {
    preloaderWrapper.classList.add("loaded");
  };
};
preLoader();

// getSiblings
var getSiblings = function (elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

/* Slide Up */
var slideUp = (target, time) => {
  const duration = time ? time : 500;
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

/* Slide Down */
var slideDown = (target, time) => {
  const duration = time ? time : 500;
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "block";
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

// Get window top offset
function TopOffset(el) {
  let rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop };
}
// Header sticky activation
const headerStickyWrapper = document.querySelector("header");
const headerStickyTarget = document.querySelector(".header__sticky");

if (headerStickyTarget) {
  let headerHeight = headerStickyWrapper.clientHeight;
  window.addEventListener("scroll", function () {
    let StickyTargetElement = TopOffset(headerStickyWrapper);
    let TargetElementTopOffset = StickyTargetElement.top;

    if (window.scrollY > TargetElementTopOffset) {
      headerStickyTarget.classList.add("sticky");
    } else {
      headerStickyTarget.classList.remove("sticky");
    }
  });
}

// Back to top
const scrollTop = document.getElementById("scroll__top");
if (scrollTop) {
  scrollTop.addEventListener("click", function () {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollTop.classList.add("active");
    } else {
      scrollTop.classList.remove("active");
    }
  });
}

// slider swiper activation
var swiper = new Swiper(".hero__slider--activation", {
  slidesPerView: 1,
  loop: true,
  clickable: true,
  speed: 500,
  spaceBetween: 30,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero__slider--inner .swiper-pagination",
    clickable: true,
  },
});

// product details media swiper activation
var swiperSmallProduct = new Swiper(".product__media--nav", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 4,
  direction: "vertical",
  freeMode: true,
  watchSlidesProgress: true,
  autoHeight: true,
  breakpoints: {
    768: {
      slidesPerView: 4,
    },
    576: {
      slidesPerView: 5,
    },
    480: {
      slidesPerView: 4,
    },
    200: {
      slidesPerView: 3,
    },
    0: {
      slidesPerView: 1,
    },
  },
  
});
var productBig = new Swiper(".product__media--preview", {
  loop: true,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperSmallProduct,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// product details media horizontal style activation
var swiperSmallProduct2 = new Swiper(".product__media--nav__horizontal", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    768: {
      slidesPerView: 4,
    },
    576: {
      slidesPerView: 5,
    },
    480: {
      slidesPerView: 4,
    },
    200: {
      slidesPerView: 3,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  
});
var productBig = new Swiper(".product__media--preview__horizontal", {
  loop: true,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperSmallProduct2,
  },
  
});


// product details media horizontal two style activation
var swiperSmallProduct2 = new Swiper(".product__media--nav__horizontal--two", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    768: {
      slidesPerView: 4,
    },
    576: {
      slidesPerView: 5,
    },
    480: {
      slidesPerView: 4,
    },
    200: {
      slidesPerView: 3,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  
});
var productBig = new Swiper(".product__media--preview__horizontal--two", {
  loop: true,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperSmallProduct2,
  },
  
});



// blog swiper column3 activation
var swiper = new Swiper(".blog__swiper--activation", {
  slidesPerView: 3,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  breakpoints: {
    1200: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// blog swiper column4 activation
var swiper = new Swiper(".blog__swiper--column4", {
  slidesPerView: 3,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  breakpoints: {
    1366: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


// product swiper activation
var swiper = new Swiper(".product__swiper--column1", {
  slidesPerView: 1,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


// testimonial swiper activation
var swiper = new Swiper(".testimonial__swiper--activation", {
  slidesPerView: 3,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  breakpoints: {
    1200: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// instagram swiper activation
var swiper = new Swiper(".instagram__swiper--activation", {
  slidesPerView: 7,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  breakpoints: {
    1366: {
      slidesPerView: 7,
    },
    1200: {
      slidesPerView: 6,
    },
    992: {
      slidesPerView: 5,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    576: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    0: {
      slidesPerView: 2,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


// quickview swiper activation
var swiper = new Swiper(".quickview__swiper--activation", {
  slidesPerView: 1,
  loop: true,
  clickable: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// tab activation
const tab = function (wrapper) {
  let tabContainer = document.querySelector(wrapper);
  if (tabContainer) {
    tabContainer.addEventListener("click", function (evt) {
      let listItem = evt.target;
      if (listItem.hasAttribute("data-toggle")) {
        let targetId = listItem.dataset.target,
          targetItem = document.querySelector(targetId);
        listItem.parentElement
          .querySelectorAll('[data-toggle="tab"]')
          .forEach(function (list) {
            list.classList.remove("active");
          });
        listItem.classList.add("active");
        targetItem.classList.add("active");
        setTimeout(function () {
          targetItem.classList.add("show");
        }, 150);
        getSiblings(targetItem).forEach(function (pane) {
          pane.classList.remove("show");
          setTimeout(function () {
            pane.classList.remove("active");
          }, 150);
        });
      }
    });
  }
};
// Homepage 1 product tab
tab(".project__tab--one");
tab(".product__tab--one");


// countdown activation
document.querySelectorAll("[data-countdown]").forEach(function (elem) {
  const countDownItem = function (value, label) {
    return `<div class="countdown__item" ${label}"><span class="countdown__number">${value}</span><p class="countdown__text">${label}</p></div>`;
  };
  const date = new Date(elem.getAttribute("data-countdown")).getTime(),
    second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  const countDownInterval = setInterval(function () {
    let currentTime = new Date().getTime(),
      timeDistance = date - currentTime,
      daysValue = Math.floor(timeDistance / day),
      hoursValue = Math.floor((timeDistance % day) / hour),
      minutesValue = Math.floor((timeDistance % hour) / minute),
      secondsValue = Math.floor((timeDistance % minute) / second);

    elem.innerHTML =
      countDownItem(daysValue, "days") +
      countDownItem(hoursValue, "hrs") +
      countDownItem(minutesValue, "mins") +
      countDownItem(secondsValue, "secs");

    if (timeDistance < 0) clearInterval(countDownInterval);
  }, 1000);
});


// adding & removing class function
const activeClassAction = function (toggle, target) {
  const to = document.querySelector(toggle),
    ta = document.querySelector(target);
  if (to && ta) {
    to.addEventListener("click", function (e) {
      e.preventDefault();
      let triggerItem = e.target;
      if (triggerItem.classList.contains("active")) {
        triggerItem.classList.remove("active");
        ta.classList.remove("active");
      } else {
        triggerItem.classList.add("active");
        ta.classList.add("active");
      }
    });
    document.addEventListener("click", function (event) {
      if (
        !event.target.closest(toggle) &&
        !event.target.classList.contains(toggle.replace(/\./, ""))
      ) {
        if (
          !event.target.closest(target) &&
          !event.target.classList.contains(target.replace(/\./, ""))
        ) {
          to.classList.remove("active");
          ta.classList.remove("active");
        }
      }
    });
  }
};

activeClassAction(".account__currency--link", ".dropdown__currency");
activeClassAction(".language__switcher", ".dropdown__language");
activeClassAction(
  ".offcanvas__language--switcher",
  ".offcanvas__dropdown--language"
);
activeClassAction(
  ".offcanvas__account--currency__menu",
  ".offcanvas__account--currency__submenu"
);
activeClassAction(".footer__language--link", ".footer__dropdown--language");
activeClassAction(".footer__currency--link", ".footer__dropdown--currency");

// OffCanvas Sidebar Activation
function offcanvsSidebar(openTrigger, closeTrigger, wrapper) {
  let OpenTriggerprimary__btn = document.querySelectorAll(openTrigger);
  let closeTriggerprimary__btn = document.querySelector(closeTrigger);
  let WrapperSidebar = document.querySelector(wrapper);
  let wrapperOverlay = wrapper.replace(".", "");

  function handleBodyClass(evt) {
    let eventTarget = evt.target;
    if (!eventTarget.closest(wrapper) && !eventTarget.closest(openTrigger)) {
      WrapperSidebar.classList.remove("active");
      document
        .querySelector("body")
        .classList.remove(`${wrapperOverlay}_active`);
    }
  }
  if (OpenTriggerprimary__btn && WrapperSidebar) {
    OpenTriggerprimary__btn.forEach(function (singleItem) {
      singleItem.addEventListener("click", function (e) {
        if (e.target.dataset.offcanvas != undefined) {
          WrapperSidebar.classList.add("active");
          document
            .querySelector("body")
            .classList.add(`${wrapperOverlay}_active`);
          document.body.addEventListener("click", handleBodyClass.bind(this));
        }
      });
    });
  }

  if (closeTriggerprimary__btn && WrapperSidebar) {
    closeTriggerprimary__btn.addEventListener("click", function (e) {
      if (e.target.dataset.offcanvas != undefined) {
        WrapperSidebar.classList.remove("active");
        document
          .querySelector("body")
          .classList.remove(`${wrapperOverlay}_active`);
        document.body.removeEventListener("click", handleBodyClass.bind(this));
      }
    });
  }
}

// Mini Cart
offcanvsSidebar(
  ".minicart__open--btn",
  ".minicart__close--btn",
  ".offCanvas__minicart"
);

// Search Bar
offcanvsSidebar(
  ".search__open--btn",
  ".predictive__search--close__btn",
  ".predictive__search--box"
);

// Offcanvas filter sidebar
offcanvsSidebar(
  ".widget__filter--btn",
  ".offcanvas__filter--close",
  ".offcanvas__filter--sidebar"
);

/* Offcanvas Mobile Menu Function */
const offcanvasHeader = function () {
  const offcanvasOpen = document.querySelector(
      ".offcanvas__header--menu__open--btn"
    ),
    offcanvasClose = document.querySelector(".offcanvas__close--btn"),
    offcanvasHeader = document.querySelector(".offcanvas-header"),
    offcanvasMenu = document.querySelector(".offcanvas__menu"),
    body = document.querySelector("body");
  /* Offcanvas SubMenu Toggle */
  if (offcanvasMenu) {
    offcanvasMenu
      .querySelectorAll(".offcanvas__sub_menu")
      .forEach(function (ul) {
        const subMenuToggle = document.createElement("button");
        subMenuToggle.classList.add("offcanvas__sub_menu_toggle");
        ul.parentNode.appendChild(subMenuToggle);
      });
  }
  /* Open/Close Menu On Click Toggle Button */
  if (offcanvasOpen) {
    offcanvasOpen.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.dataset.offcanvas != undefined) {
        offcanvasHeader.classList.add("open");
        body.classList.add("mobile_menu_open");
      }
    });
  }
  if (offcanvasClose) {
    offcanvasClose.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.dataset.offcanvas != undefined) {
        offcanvasHeader.classList.remove("open");
        body.classList.remove("mobile_menu_open");
      }
    });
  }

  /* Mobile submenu slideToggle Activation */
  let mobileMenuWrapper = document.querySelector(".offcanvas__menu_ul");
  if (mobileMenuWrapper) {
    mobileMenuWrapper.addEventListener("click", function (e) {
      let targetElement = e.target;
      if (targetElement.classList.contains("offcanvas__sub_menu_toggle")) {
        const parent = targetElement.parentElement;
        if (parent.classList.contains("active")) {
          targetElement.classList.remove("active");
          parent.classList.remove("active");
          parent
            .querySelectorAll(".offcanvas__sub_menu")
            .forEach(function (subMenu) {
              subMenu.parentElement.classList.remove("active");
              subMenu.nextElementSibling.classList.remove("active");
              slideUp(subMenu);
            });
        } else {
          targetElement.classList.add("active");
          parent.classList.add("active");
          slideDown(targetElement.previousElementSibling);
          getSiblings(parent).forEach(function (item) {
            item.classList.remove("active");
            item
              .querySelectorAll(".offcanvas__sub_menu")
              .forEach(function (subMenu) {
                subMenu.parentElement.classList.remove("active");
                subMenu.nextElementSibling.classList.remove("active");
                slideUp(subMenu);
              });
          });
        }
      }
    });
  }

  if (offcanvasHeader) {
    document.addEventListener("click", function (event) {
      if (
        !event.target.closest(".offcanvas__header--menu__open--btn") &&
        !event.target.classList.contains(
          ".offcanvas__header--menu__open--btn".replace(/\./, "")
        )
      ) {
        if (
          !event.target.closest(".offcanvas-header") &&
          !event.target.classList.contains(
            ".offcanvas-header".replace(/\./, "")
          )
        ) {
          offcanvasHeader.classList.remove("open");
          body.classList.remove("mobile_menu_open");
        }
      }
    });
  }

  /* Remove Mobile Menu Open Class & Hide Mobile Menu When Window Width in More Than 991 */
  if (offcanvasHeader) {
    window.addEventListener("resize", function () {
      if (window.outerWidth >= 992) {
        offcanvasHeader.classList.remove("open");
        body.classList.remove("mobile_menu_open");
      }
    });
  }
};
/* Mobile Menu Active */
offcanvasHeader();

// Increment & Decrement Qunatity Button
const quantityWrapper = document.querySelectorAll(".quantity__box");
if (quantityWrapper) {
  quantityWrapper.forEach(function (singleItem) {
    let increaseButton = singleItem.querySelector(".increase");
    let decreaseButton = singleItem.querySelector(".decrease");

    increaseButton.addEventListener("click", function (e) {
      let input = e.target.previousElementSibling.children[0];
      if (input.dataset.counter != undefined) {
        let value = parseInt(input.value, 10);
        value = isNaN(value) ? 0 : value;
        value++;
        input.value = value;
      }
    });

    decreaseButton.addEventListener("click", function (e) {
      let input = e.target.nextElementSibling.children[0];
      if (input.dataset.counter != undefined) {
        let value = parseInt(input.value, 10);
        value = isNaN(value) ? 0 : value;
        value < 1 ? (value = 1) : "";
        value--;
        input.value = value;
      }
    });
  });
}


// Accordion
function customAccordion(accordionWrapper, singleItem, accordionBody) {
  let accoridonButtons = document.querySelectorAll(accordionWrapper);
  accoridonButtons.forEach(function (item) {
    item.addEventListener("click", function (evt) {
      let itemTarget = evt.target;
      if (
        itemTarget.classList.contains("accordion__items--button") ||
        itemTarget.classList.contains("widget__categories--menu__label")
      ) {
        let singleAccordionWrapper = itemTarget.closest(singleItem),
          singleAccordionBody =
            singleAccordionWrapper.querySelector(accordionBody);
        if (singleAccordionWrapper.classList.contains("active")) {
          singleAccordionWrapper.classList.remove("active");
          slideUp(singleAccordionBody);
        } else {
          singleAccordionWrapper.classList.add("active");
          slideDown(singleAccordionBody);
          getSiblings(singleAccordionWrapper).forEach(function (item) {
            let sibllingSingleAccordionBody = item.querySelector(accordionBody);
            item.classList.remove("active");
            slideUp(sibllingSingleAccordionBody);
          });
        }
      }
    });
  });
}
customAccordion(
  ".accordion__container",
  ".accordion__items",
  ".accordion__items--body"
);

customAccordion(
  ".widget__categories--menu",
  ".widget__categories--menu__list",
  ".widget__categories--sub__menu"
);

// footer widget js
let accordion = true;
const footerWidgetAccordion = function () {
  accordion = false;
  let footerWidgetContainer = document.querySelector(".main__footer");
  footerWidgetContainer.addEventListener("click", function (evt) {
    let singleItemTarget = evt.target;
    if (singleItemTarget.classList.contains("footer__widget--button")) {
      const footerWidget = singleItemTarget.closest(".footer__widget"),
        footerWidgetInner = footerWidget.querySelector(
          ".footer__widget--inner"
        );
      if (footerWidget.classList.contains("active")) {
        footerWidget.classList.remove("active");
        slideUp(footerWidgetInner);
      } else {
        footerWidget.classList.add("active");
        slideDown(footerWidgetInner);
        getSiblings(footerWidget).forEach(function (item) {
          const footerWidgetInner = item.querySelector(
            ".footer__widget--inner"
          );

          item.classList.remove("active");
          slideUp(footerWidgetInner);
        });
      }
    }
  });
};

window.addEventListener("load", function () {
  if (accordion) {
    footerWidgetAccordion();
  }
});
window.addEventListener("resize", function () {
  document.querySelectorAll(".footer__widget").forEach(function (item) {
    if (window.outerWidth >= 768) {
      item.classList.remove("active");
      item.querySelector(".footer__widget--inner").style.display = "";
    }
  });
  if (accordion) {
    footerWidgetAccordion();
  }
});

// lightbox Activation
const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">{nextSVG}</button>
    <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
    <button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>
    </div>
    </div>`;
const lightbox = GLightbox({
  touchNavigation: true,
  lightboxHTML: customLightboxHTML,
  loop: true,
});

// CounterUp Activation
const wrapper = document.getElementById("funfactId");
if (wrapper) {
  const counters = wrapper.querySelectorAll(".js-counter");
  const duration = 1000;

  let isCounted = false;
  document.addEventListener("scroll", function () {
    const wrapperPos = wrapper.offsetTop - window.innerHeight;
    if (!isCounted && window.scrollY > wrapperPos) {
      counters.forEach((counter) => {
        const countTo = counter.dataset.count;

        const countPerMs = countTo / duration;

        let currentCount = 0;
        const countInterval = setInterval(function () {
          if (currentCount >= countTo) {
            clearInterval(countInterval);
          }
          counter.textContent = Math.round(currentCount);
          currentCount = currentCount + countPerMs;
        }, 1);
      });
      isCounted = true;
    }
  });
}

// Newsletter popup
const newsletterPopup = function () {
  let newsletterWrapper = document.querySelector(".newsletter__popup"),
    newsletterCloseButton = document.querySelector(
      ".newsletter__popup--close__btn"
    ),
    dontShowPopup = document.querySelector("#newsletter__dont--show"),
    popuDontShowMode = localStorage.getItem("newsletter__show");

  if (newsletterWrapper && popuDontShowMode == null) {
    window.addEventListener("load", (event) => {
      setTimeout(function () {
        document.body.classList.add("overlay__active");
        newsletterWrapper.classList.add("newsletter__show");

        document.addEventListener("click", function (event) {
          if (!event.target.closest(".newsletter__popup--inner")) {
            document.body.classList.remove("overlay__active");
            newsletterWrapper.classList.remove("newsletter__show");
          }
        });

        newsletterCloseButton.addEventListener("click", function () {
          document.body.classList.remove("overlay__active");
          newsletterWrapper.classList.remove("newsletter__show");
        });

        dontShowPopup.addEventListener("click", function () {
          if (dontShowPopup.checked) {
            localStorage.setItem("newsletter__show", true);
          } else {
            localStorage.removeItem("newsletter__show");
          }
        });
      }, 3000);
    });
  }
};
newsletterPopup();

(() => {
  const STORAGE_KEY = "antenna_shop_cart_v1";
  const LEGACY_STORAGE_KEY = "miniCart";
  const DEFAULT_PRODUCT_NAME = "Товар";

  const money = (n) => {
    const value = Number(n) || 0;
    try {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `₽${Math.round(value)}`;
    }
  };

  const makeId = (item) => {
    if (item && item.id) return String(item.id);
    const safe = item || {};
    const name = safe.name || safe.title || DEFAULT_PRODUCT_NAME;
    const price = Number(safe.price || 0);
    const img = safe.img || "";
    return `${name}|${price}|${img}`.toLowerCase().replace(/\s+/g, " ").trim();
  };

  const normalizeName = (value) => {
    const name = String(value || "").trim();
    if (!name) return DEFAULT_PRODUCT_NAME;
    return name.toLowerCase() === "product" ? DEFAULT_PRODUCT_NAME : name;
  };

  const normalizeCart = (list) => (Array.isArray(list) ? list : [])
    .map((item) => ({
      id: makeId(item),
      name: normalizeName(item && (item.name || item.title)),
      price: Number(item && item.price) || 0,
      img: (item && item.img) || "",
      qty: Math.max(1, parseInt(item && item.qty, 10) || 1),
      url: (item && item.url) || "product-details.html",
    }))
    .filter((item) => Boolean(item.id));

  const loadRaw = (key) => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCart(cart)));
  };

  const loadCart = () => {
    const primary = normalizeCart(loadRaw(STORAGE_KEY));
    if (primary.length) return primary;

    const legacy = normalizeCart(loadRaw(LEGACY_STORAGE_KEY));
    if (legacy.length) {
      saveCart(legacy);
      return legacy;
    }
    return [];
  };

  const calcTotal = (cart) => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const ensureMiniCartStyles = () => {
    if (document.getElementById("global-minicart-style")) return;
    const style = document.createElement("style");
    style.id = "global-minicart-style";
    style.textContent =
      ".global-minicart-list{max-height:320px;overflow:auto;padding:0 16px 8px;}" +
      ".global-minicart-item{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #eceff3;}" +
      ".global-minicart-item:last-child{border-bottom:0;}" +
      ".global-minicart-thumb{width:62px;height:62px;flex:0 0 62px;border-radius:8px;overflow:hidden;background:#f3f5f8;}" +
      ".global-minicart-thumb img{width:100%;height:100%;object-fit:cover;display:block;}" +
      ".global-minicart-body{flex:1;min-width:0;}" +
      ".global-minicart-title{display:block;font-size:13px;line-height:1.25;color:#1a2433;font-weight:600;text-decoration:none;margin-bottom:4px;}" +
      ".global-minicart-price{font-size:13px;font-weight:700;color:#1c4db2;margin-bottom:7px;}" +
      ".global-minicart-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;}" +
      ".global-minicart-qty{display:flex;align-items:center;gap:6px;}" +
      ".global-minicart-qty .quantity__value{width:26px;height:26px;border:1px solid #d7dfe9;border-radius:7px;background:#fff;line-height:1;}" +
      ".global-minicart-qty .quantity__number{width:38px;height:26px;border:1px solid #d7dfe9;border-radius:7px;text-align:center;padding:0 4px;}" +
      ".global-minicart-remove{border:1px solid #d7dfe9;border-radius:7px;background:#fff;padding:4px 8px;font-size:12px;}" +
      ".cart__btn--animate{animation:cartBtnPulse .34s ease;}" +
      "@keyframes cartBtnPulse{0%{transform:scale(1);}45%{transform:scale(1.08);}100%{transform:scale(1);}}" +
      ".cart__notice{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:#111;color:#fff;padding:10px 12px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;max-width:92vw;}" +
      ".cart__notice--text{font-size:14px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
      ".cart__notice--btn{font-size:12px;line-height:1;padding:7px 10px;border-radius:8px;background:#fff;color:#111;text-decoration:none;font-weight:600;flex-shrink:0;}" +
      "@media (max-width:575px){.cart__notice{left:12px;right:12px;transform:none;}.cart__notice--text{white-space:normal;}}";
    document.head.appendChild(style);
  };

  const animateCartButton = (btn) => {
    if (!btn) return;
    btn.classList.remove("cart__btn--animate");
    void btn.offsetWidth;
    btn.classList.add("cart__btn--animate");
  };

  const showCartNotice = (text) => {
    ensureMiniCartStyles();
    const prev = document.getElementById("cart-notice");
    if (prev) prev.remove();
    const node = document.createElement("div");
    node.id = "cart-notice";
    node.className = "cart__notice";
    node.innerHTML =
      `<span class="cart__notice--text">${text || "Товар добавлен в корзину"}</span>` +
      '<a class="cart__notice--btn" href="javascript:void(0)" data-open-minicart>Открыть корзину</a>';
    document.body.appendChild(node);
    window.setTimeout(() => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }, 2200);
  };

  const resolveItemsRoot = () => {
    const miniRoot = document.querySelector(".offCanvas__minicart");
    if (!miniRoot) return null;

    const productWrap = miniRoot.querySelector(".minicart__product");
    if (productWrap) return productWrap;

    const direct =
      document.getElementById("miniCartItems") ||
      document.getElementById("minicart-items") ||
      miniRoot.querySelector(".minicart__product--items");
    if (direct) return direct;

    const wrap = document.createElement("div");
    wrap.className = "minicart__product";
    wrap.innerHTML = '<div id="miniCartItems" class="global-minicart-list"></div>';
    const amount = miniRoot.querySelector(".minicart__amount");
    if (amount) {
      miniRoot.insertBefore(wrap, amount);
    } else {
      miniRoot.appendChild(wrap);
    }
    return wrap.querySelector("#miniCartItems");
  };

  const updateTotals = (total) => {
    const subTotalEl = document.getElementById("miniCartSubTotal");
    const totalEl = document.getElementById("miniCartTotal");
    if (subTotalEl) subTotalEl.textContent = money(total);
    if (totalEl) totalEl.textContent = money(total);

    const amountNodes = document.querySelectorAll(".minicart__amount_list b");
    if (amountNodes[0]) amountNodes[0].textContent = money(total);
    if (amountNodes[1]) amountNodes[1].textContent = money(total);
  };

  const renderCart = () => {
    ensureMiniCartStyles();
    const itemsRoot = resolveItemsRoot();
    if (!itemsRoot) return;

    const cart = loadCart();
    const total = calcTotal(cart);
    updateTotals(total);

    const rowTag = itemsRoot.tagName === "UL" ? "li" : "div";
    itemsRoot.innerHTML = cart.map((item) => `
      <${rowTag} class="minicart__product--items global-minicart-item" data-id="${item.id}">
        <div class="global-minicart-thumb">
          <a href="${item.url || "product-details.html"}"><img src="${item.img || ""}" alt="product-img"></a>
        </div>
        <div class="global-minicart-body">
          <a class="global-minicart-title" href="${item.url || "product-details.html"}">${normalizeName(item.name)}</a>
          <div class="global-minicart-price">${money(item.price * item.qty)}</div>
          <div class="global-minicart-actions">
            <div class="global-minicart-qty">
              <button type="button" class="quantity__value decrease" aria-label="quantity value">-</button>
              <input type="number" class="quantity__number" value="${item.qty}" min="1" data-counter />
              <button type="button" class="quantity__value increase" aria-label="quantity value">+</button>
            </div>
            <button class="minicart__product--remove global-minicart-remove" aria-label="minicart remove btn">Удалить</button>
          </div>
        </div>
      </${rowTag}>
    `).join("");

    const desc = document.querySelector(".minicart__header--desc");
    if (desc) desc.textContent = cart.length ? "Товары в корзине" : "Корзина пуста";
  };

  const setQty = (id, qty) => {
    const cart = loadCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;
    item.qty = Math.max(1, parseInt(qty, 10) || 1);
    saveCart(cart);
    renderCart();
  };

  const changeQty = (id, delta) => {
    const cart = loadCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;
    item.qty = Math.max(1, (item.qty || 1) + delta);
    saveCart(cart);
    renderCart();
  };

  const removeItem = (id) => {
    const cart = loadCart().filter((x) => x.id !== id);
    saveCart(cart);
    renderCart();
  };

  const addToCart = (product) => {
    if (!product) return;
    const id = makeId(product);
    const cart = loadCart();
    const found = cart.find((x) => x.id === id);
    if (found) {
      found.qty += Math.max(1, parseInt(product.qty, 10) || 1);
    } else {
      cart.push({
        id,
        name: normalizeName(product.name || product.title),
        price: Number(product.price) || 0,
        img: product.img || "",
        url: product.url || "product-details.html",
        qty: Math.max(1, parseInt(product.qty, 10) || 1),
      });
    }
    saveCart(cart);
    renderCart();
  };

  document.addEventListener("click", (e) => {
    const row = e.target.closest(".minicart__product--items");
    if (!row) return;
    const id = row.getAttribute("data-id");
    if (!id) return;
    if (e.target.closest(".increase")) changeQty(id, +1);
    if (e.target.closest(".decrease")) changeQty(id, -1);
    if (e.target.closest(".minicart__product--remove")) removeItem(id);
  });

  // Visual feedback for all "add to cart" triggers across pages.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(
      "a.product__card--btn, button.quickview__cart--btn, a.quickview__cart--btn, a.wishlist__cart--btn[data-action='add-to-cart']"
    );
    if (!btn) return;
    animateCartButton(btn);
    showCartNotice("Товар добавлен в корзину");
  });

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-minicart]");
    if (!openBtn) return;
    e.preventDefault();
    const btn = document.querySelector(".minicart__open--btn");
    if (btn) btn.click();
  });

  document.addEventListener("change", (e) => {
    const input = e.target.closest(".quantity__number");
    if (!input) return;
    const row = e.target.closest(".minicart__product--items");
    if (!row) return;
    const id = row.getAttribute("data-id");
    if (!id) return;
    setQty(id, input.value);
  });

  window.MiniCart = {
    add: addToCart,
    render: renderCart,
    clear: () => { saveCart([]); renderCart(); },
    get: loadCart,
  };

  renderCart();
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) renderCart();
  });
  window.addEventListener("focus", renderCart);
})();

// Global wishlist actions (catalog cards + quickview) with animated notice
(() => {
  const WISHLIST_KEY = "antenna_shop_wishlist_v1";
  const DEFAULT_NAME = "Товар";
  const WISHLIST_LINK = "wishlist.html";

  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const qs = (sel, root = document) => root.querySelector(sel);
  const normalize = (s) => String(s || "").replace(/\s+/g, " ").trim();
  const parsePrice = (text) => {
    const digits = String(text || "").replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const loadWishlist = () => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveWishlist = (list) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list || []));
    } catch {}
  };

  const wishlistItemId = (item) =>
    `${item.name || DEFAULT_NAME}|${Number(item.price) || 0}|${item.img || ""}`
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const ensureWishlistStyles = () => {
    if (document.getElementById("global-wishlist-style")) return;
    const st = document.createElement("style");
    st.id = "global-wishlist-style";
    st.textContent =
      ".product__card--action__btn.is-in-wishlist,.quickview__variant--wishlist__icon.is-in-wishlist,.variant__wishlist--icon.is-in-wishlist{color:#d61f2c;}" +
      ".product__card--action__btn.is-in-wishlist svg path,.quickview__variant--wishlist__icon.is-in-wishlist svg path,.variant__wishlist--icon.is-in-wishlist svg path{fill:currentColor;}" +
      ".wishlist__pulse{animation:wishlistPulse .32s ease;}" +
      "@keyframes wishlistPulse{0%{transform:scale(1);}45%{transform:scale(1.2);}100%{transform:scale(1);}}" +
      ".wishlist__notice{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:#111;color:#fff;padding:10px 12px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;max-width:92vw;}" +
      ".wishlist__notice--text{font-size:14px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
      ".wishlist__notice--link{font-size:12px;line-height:1;padding:7px 10px;border-radius:8px;background:#fff;color:#111;text-decoration:none;font-weight:600;flex-shrink:0;}" +
      "@media (max-width:575px){.wishlist__notice{left:12px;right:12px;transform:none;}.wishlist__notice--text{white-space:normal;}}";
    document.head.appendChild(st);
  };

  const showWishlistNotice = (text, showLink) => {
    ensureWishlistStyles();
    const prev = document.getElementById("wishlist-notice");
    if (prev) prev.remove();
    const node = document.createElement("div");
    node.id = "wishlist-notice";
    node.className = "wishlist__notice";
    node.innerHTML =
      `<span class="wishlist__notice--text">${text}</span>` +
      (showLink
        ? `<a class="wishlist__notice--link" href="${WISHLIST_LINK}">Перейти в избранное</a>`
        : "");
    document.body.appendChild(node);
    window.setTimeout(() => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }, 2400);
  };

  const getItemFromButton = (btn) => {
    const card = btn.closest(".product__card");
    const scope =
      card ||
      btn.closest(".quickview__modal") ||
      btn.closest(".product__details--section") ||
      btn.closest(".single__product") ||
      document;

    const titleEl =
      qs(".product__card--title a", scope) ||
      qs(".product__card--title", scope) ||
      qs(".quickview__info--title a", scope) ||
      qs(".quickview__info--title", scope) ||
      qs(".product__details--info h2", scope) ||
      qs(".product__details--title", scope);
    const priceEl =
      qs(".product__card--price .current__price", scope) ||
      qs(".current__price", scope) ||
      qs(".new__price", scope);
    const imgEl =
      qs("img.product__primary--img", scope) ||
      qs(".product__card--thumbnail img", scope) ||
      qs(".quickview__slider--items img", scope) ||
      qs(".product__media--preview img", scope);
    const linkEl =
      qs(".product__card--title a", scope) ||
      qs(".product__card--thumbnail__link", scope) ||
      qs(".quickview__info--title a", scope);

    const name = normalize(titleEl ? titleEl.textContent : DEFAULT_NAME) || DEFAULT_NAME;
    const price = parsePrice(priceEl ? priceEl.textContent : "");
    const img = imgEl ? imgEl.getAttribute("src") || "" : "";
    const url = linkEl ? linkEl.getAttribute("href") || "product-details.html" : "product-details.html";

    return {
      id: wishlistItemId({ name, price, img }),
      name,
      price,
      img,
      category: card && card.dataset ? card.dataset.category || "" : "",
      url,
    };
  };

  const wishlistButtons = () =>
    qsa(
      "a.product__card--action__btn[title*='ishlist' i], " +
      "a.product__card--action__btn[title*='избран' i], " +
      "a.quickview__variant--wishlist__icon, " +
      "a.variant__wishlist--icon"
    );

  const syncWishlistButtons = () => {
    const ids = new Set(loadWishlist().map((x) => x.id));
    wishlistButtons().forEach((btn) => {
      const item = getItemFromButton(btn);
      btn.classList.toggle("is-in-wishlist", ids.has(item.id));
    });
  };

  const bindWishlistButtons = () => {
    ensureWishlistStyles();
    wishlistButtons().forEach((btn) => {
      if (btn.dataset.wishlistGlobalBound === "1") return;
      btn.dataset.wishlistGlobalBound = "1";

      btn.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();

        const item = getItemFromButton(btn);
        let list = loadWishlist();
        const exists = list.some((x) => x.id === item.id);

        if (exists) {
          list = list.filter((x) => x.id !== item.id);
          saveWishlist(list);
          btn.classList.remove("is-in-wishlist");
          showWishlistNotice("Удалено из избранного", true);
        } else {
          list.push(item);
          saveWishlist(list);
          btn.classList.add("is-in-wishlist");
          showWishlistNotice(`Добавлено: ${item.name}`, true);
        }

        btn.classList.remove("wishlist__pulse");
        void btn.offsetWidth;
        btn.classList.add("wishlist__pulse");
        syncWishlistButtons();
      });
    });
  };

  if (!wishlistButtons().length) return;
  // Used by page-level scripts to avoid duplicate wishlist bindings.
  window.__globalWishlistHandled = true;
  bindWishlistButtons();
  syncWishlistButtons();
  window.addEventListener("storage", (e) => {
    if (e.key === WISHLIST_KEY) syncWishlistButtons();
  });
  window.addEventListener("focus", syncWishlistButtons);
})();

// Product search suggestions (footer + mobile predictive)
(() => {
  const configs = [
    {
      inputSelector: ".footer__newsletter--input.newsletter__subscribe--input",
      formSelector: "form",
      boundKey: "productSearchBound",
      styleId: "footer-product-search-style",
      panelClass: "footer-product-search__panel",
      itemClass: "footer-product-search__item",
      imgClass: "footer-product-search__img",
      titleClass: "footer-product-search__title",
      priceClass: "footer-product-search__price",
      emptyClass: "footer-product-search__empty",
      revealAnim: "footerSearchReveal",
      notFoundText: "По вашему запросу ничего не найдено",
      maxResults: 4,
      highlightTitle: true,
      extraCss:
        ".footer__newsletter--form{position:relative;}" +
        ".footer-product-search__panel{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:30;background:#fff;border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.12);max-height:320px;overflow:auto;padding:8px;display:none;}" +
        ".footer-product-search__panel.active{display:block;}" +
        ".footer-product-search__item{display:flex;gap:10px;align-items:center;padding:8px;border-radius:10px;text-decoration:none;color:inherit;opacity:0;transform:translateY(6px) scale(.98);}" +
        ".footer-product-search__item:hover{background:#f7f8fa;}" +
        ".footer-product-search__img{width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;}" +
        ".footer-product-search__title{display:block;font-size:14px;line-height:1.3;font-weight:600;color:#1f1f1f;}" +
        ".footer-product-search__price{display:block;font-size:13px;color:#646464;margin-top:2px;}" +
        ".footer-product-search__empty{padding:10px 12px;font-size:13px;color:#646464;}",
    },
    {
      inputSelector: ".predictive__search--input",
      formSelector: ".predictive__search--form, form",
      boundKey: "mobileSearchBound",
      styleId: "mobile-product-search-style",
      panelClass: "mobile-product-search__panel",
      itemClass: "mobile-product-search__item",
      imgClass: "mobile-product-search__img",
      titleClass: "mobile-product-search__title",
      priceClass: "mobile-product-search__price",
      emptyClass: "mobile-product-search__empty",
      revealAnim: "mobileSearchReveal",
      notFoundText: "Ничего не найдено",
      maxResults: 5,
      highlightTitle: false,
      extraCss:
        ".predictive__search--form{position:relative;}" +
        ".mobile-product-search__panel{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:60;background:#fff;border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.16);max-height:300px;overflow:auto;padding:8px;display:none;}" +
        ".mobile-product-search__panel.active{display:block;}" +
        ".mobile-product-search__item{display:flex;gap:10px;align-items:center;padding:8px;border-radius:10px;text-decoration:none;color:inherit;opacity:0;transform:translateY(6px) scale(.98);}" +
        ".mobile-product-search__item:hover{background:#f6f8fb;}" +
        ".mobile-product-search__img{width:54px;height:54px;object-fit:cover;border-radius:8px;flex-shrink:0;}" +
        ".mobile-product-search__title{display:block;font-size:14px;line-height:1.3;font-weight:600;color:#1f1f1f;}" +
        ".mobile-product-search__price{display:block;font-size:13px;color:#646464;margin-top:2px;}" +
        ".mobile-product-search__empty{padding:10px 12px;font-size:13px;color:#646464;}",
    },
    {
      inputSelector: ".widget__search--form__input",
      formSelector: ".widget__search--form, form",
      boundKey: "articleSearchBound",
      styleId: "article-product-search-style",
      panelClass: "article-product-search__panel",
      itemClass: "article-product-search__item",
      imgClass: "article-product-search__img",
      titleClass: "article-product-search__title",
      priceClass: "article-product-search__price",
      emptyClass: "article-product-search__empty",
      revealAnim: "articleSearchReveal",
      notFoundText: "По вашему запросу ничего не найдено",
      maxResults: 5,
      highlightTitle: true,
      extraCss:
        ".widget__search--form{position:relative;}" +
        ".article-product-search__panel{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:40;background:#fff;border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.14);max-height:320px;overflow:auto;padding:8px;display:none;}" +
        ".article-product-search__panel.active{display:block;}" +
        ".article-product-search__item{display:flex;gap:10px;align-items:center;padding:8px;border-radius:10px;text-decoration:none;color:inherit;opacity:0;transform:translateY(6px) scale(.98);}" +
        ".article-product-search__item:hover{background:#f7f8fa;}" +
        ".article-product-search__img{width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;}" +
        ".article-product-search__title{display:block;font-size:14px;line-height:1.3;font-weight:600;color:#1f1f1f;}" +
        ".article-product-search__price{display:block;font-size:13px;color:#646464;margin-top:2px;}" +
        ".article-product-search__empty{padding:10px 12px;font-size:13px;color:#646464;}",
    },
  ];

  const hasAnyTarget = configs.some(
    (cfg) => document.querySelectorAll(cfg.inputSelector).length > 0
  );
  if (!hasAnyTarget) return;

  const fallbackProducts = [
    { title: "Комнатная DVB-T2 антенна", price: "245", img: "assets/img/product/product1.webp", link: "shop.html" },
    { title: "Наружная антенна LTE/4G MIMO", price: "245", img: "assets/img/product/product3.webp", link: "shop.html" },
    { title: "Спутниковая антенна 0,9 м", price: "245", img: "assets/img/product/product5.webp", link: "shop.html" },
    { title: "Репитер GSM 900/1800", price: "278", img: "assets/img/product/product2.webp", link: "shop.html" },
    { title: "Усилитель сигнала 3G/4G", price: "220", img: "assets/img/product/product4.webp", link: "shop.html" },
    { title: "Антенна для интернета 4G", price: "249", img: "assets/img/product/product6.webp", link: "shop.html" },
  ];

  const normalize = (text) =>
    String(text || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/\s+/g, " ")
      .trim();

  const escapeHtml = (text) =>
    String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const parsePrice = (text) => {
    const raw = String(text || "").replace(/\u00a0/g, " ");
    const match = raw.match(/[-+]?[0-9][0-9\s.,]*/);
    if (!match) return "";
    return match[0].replace(/[^\d]/g, "");
  };

  const collectPageProducts = () => {
    const rows = [];
    document.querySelectorAll("article.product__card").forEach((card) => {
      const titleEl =
        card.querySelector(".product__card--title a") ||
        card.querySelector(".product__card--title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      if (!title) return;

      const priceEl =
        card.querySelector(".current__price") ||
        card.querySelector(".product__card--price .current__price");
      const imgEl =
        card.querySelector("img.product__primary--img") ||
        card.querySelector(".product__card--thumbnail img");
      const linkEl =
        card.querySelector(".product__card--title a") ||
        card.querySelector(".product__card--thumbnail__link");

      rows.push({
        title: title,
        price: parsePrice(priceEl ? priceEl.textContent : ""),
        img: imgEl ? imgEl.getAttribute("src") : "assets/img/product/product1.webp",
        link: linkEl ? linkEl.getAttribute("href") || "shop.html" : "shop.html",
      });
    });
    return rows;
  };

  const dedupeProducts = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      const key = normalize(item.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const allProducts = dedupeProducts(
    collectPageProducts().concat(fallbackProducts)
  );
  if (!allProducts.length) return;

  const highlightTitle = (title, query, useHighlight) => {
    const cleanTitle = String(title || "");
    if (!useHighlight) return escapeHtml(cleanTitle);
    const q = normalize(query);
    if (!q) return escapeHtml(cleanTitle);
    const idx = normalize(cleanTitle).indexOf(q);
    if (idx < 0) return escapeHtml(cleanTitle);
    const start = cleanTitle.slice(0, idx);
    const mid = cleanTitle.slice(idx, idx + query.length);
    const end = cleanTitle.slice(idx + query.length);
    return `${escapeHtml(start)}<mark>${escapeHtml(mid)}</mark>${escapeHtml(end)}`;
  };

  const searchProducts = (query, maxResults) => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return allProducts
      .filter((item) => normalize(item.title).includes(q))
      .slice(0, maxResults || 4);
  };

  const ensureStyles = (cfg) => {
    if (document.getElementById(cfg.styleId)) return;
    const style = document.createElement("style");
    style.id = cfg.styleId;
    style.textContent =
      cfg.extraCss +
      `.${cfg.itemClass}{animation:${cfg.revealAnim} .25s ease forwards;}` +
      `@keyframes ${cfg.revealAnim}{to{opacity:1;transform:translateY(0) scale(1);}}`;
    document.head.appendChild(style);
  };

  configs.forEach((cfg) => {
    const inputs = document.querySelectorAll(cfg.inputSelector);
    if (!inputs.length) return;
    ensureStyles(cfg);

    inputs.forEach((input) => {
      const form = input.closest(cfg.formSelector);
      if (!form || form.dataset[cfg.boundKey] === "1") return;
      form.dataset[cfg.boundKey] = "1";

      const panel = document.createElement("div");
      panel.className = cfg.panelClass;
      form.appendChild(panel);

      let lastResults = [];

      const renderPanel = (query) => {
        const results = searchProducts(query, cfg.maxResults);
        lastResults = results;

        if (!results.length) {
          panel.innerHTML =
            normalize(query).length >= 2
              ? `<div class="${cfg.emptyClass}">${cfg.notFoundText}</div>`
              : "";
          panel.classList.toggle("active", normalize(query).length >= 2);
          return;
        }

        panel.innerHTML = results
          .map((item, index) => {
            const titleHtml = highlightTitle(item.title, query, cfg.highlightTitle);
            return (
              `<a class="${cfg.itemClass}" href="${escapeHtml(item.link || "shop.html")}" style="animation-delay:${index * 50}ms">` +
                `<img class="${cfg.imgClass}" src="${escapeHtml(item.img || "assets/img/product/product1.webp")}" alt="product">` +
                "<span>" +
                  `<span class="${cfg.titleClass}">${titleHtml}</span>` +
                  `<span class="${cfg.priceClass}">${item.price ? item.price + " ₽" : ""}</span>` +
                "</span>" +
              "</a>"
            );
          })
          .join("");
        panel.classList.add("active");
      };

      input.addEventListener("input", () => renderPanel(input.value));
      input.addEventListener("focus", () => {
        if (normalize(input.value).length >= 2) renderPanel(input.value);
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const results = searchProducts(input.value, cfg.maxResults);
        if (results.length) {
          window.location.href = results[0].link || "shop.html";
        } else {
          renderPanel(input.value);
        }
      });

      panel.addEventListener("click", () => panel.classList.remove("active"));

      document.addEventListener("click", (e) => {
        if (!form.contains(e.target)) panel.classList.remove("active");
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") panel.classList.remove("active");
        if (e.key === "Enter" && lastResults.length) {
          e.preventDefault();
          window.location.href = lastResults[0].link || "shop.html";
        }
      });
    });
  });
})();
