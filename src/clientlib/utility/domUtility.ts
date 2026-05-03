"use client";

import { observe } from "@src/clientlib/utility/viewportObserver";
import clientUtil from "@clientlib/utility/cookie";

class DomUtility {
  public getTopNavHeight(): number {
    let topNavHeight = 0;

    const topNavElement =
      document.querySelector<HTMLElement>(`[data-anchor="nav"]`);
    const promoBannerElement =
      document.querySelector<HTMLElement>(`#promo-banner`);

    if (topNavElement) {
      topNavHeight = topNavElement.getBoundingClientRect().height;
    }

    if (promoBannerElement) {
      const promoBannerHeight =
        promoBannerElement.getBoundingClientRect().height || 0;
      topNavHeight += promoBannerHeight;
    }
    return topNavHeight;
  }

  public getNextElementSibling(element: HTMLElement): HTMLElement | null {
    // get the next sibling element or the footer element
    const nextElement = (element.nextElementSibling ||
      document.querySelector('[role="contentinfo"]')) as HTMLElement | null;
    return nextElement;
  }

  public isMobileDevice(): boolean {
    return window.innerWidth < 800;
  }

  private routerPush(target: string) {
    const newUrl = `${window.location.pathname}${target}`;
    history.pushState(null, "", newUrl);
  }

  public hideParentElement(element: HTMLElement): void {
    let parentElement = element?.parentElement;
    if (parentElement) {
      clientUtil.putCookie("promoBannerDismissed", "true", {
        expires: 1,
      });
      parentElement.classList.add("d-none");
    }
  }

  public handleHeaderBannerCloseClick(element: HTMLElement): void {
    const toggle = element?.getAttribute("data-topnav-target");
    const targetElement = document.querySelector<HTMLElement>(`${toggle}`);
    if (targetElement) {
      const targetElementStyle = targetElement.getAttribute("style");
      if (targetElementStyle?.includes("display: flex")) {
        targetElement.setAttribute(
          "style",
          "display: flex; --promo-banner-height: " + 0 + "px;",
        );
        this.hideParentElement(element);
        return;
      }
    }
    this.hideParentElement(element);
  }

  public handleTopNavToggleClick(element: HTMLElement): void {
    const toggle = element?.getAttribute("data-topnav-menu-toggle");
    const toggleTarget = element?.getAttribute("data-topnav-toggle-target");
    const promoBanner = document.querySelector<HTMLElement>("#promo-banner");

    if (!toggle || !toggleTarget) {
      return;
    }

    const targetElementToogle = document.querySelector<HTMLElement>(
      `#${toggle}`,
    );
    const targetElementClassList = targetElementToogle?.getAttribute("class");
    const targetElement = document.querySelector<HTMLElement>(toggleTarget);

    if (targetElementToogle && targetElementClassList) {
      if (targetElementClassList?.includes(toggle)) {
        targetElementToogle.classList.remove(toggle);
        if (!targetElement) return;
        targetElement.style.display = "none";
      } else {
        targetElementToogle.classList.add(toggle);
        if (!targetElement) return;
        const promoBannerHeight =
          promoBanner?.getBoundingClientRect().height || 0;
        targetElement.setAttribute(
          "style",
          "display: flex; --promo-banner-height: " + promoBannerHeight + "px;",
        );
      }
    }
  }

  public handleTopNavDropdownClick = (element: HTMLElement): void => {
    const navElementId = element?.getAttribute("id");
    const navToggle = element?.getAttribute("data-toggle-menu");
    const isAnchorLink = element?.getAttribute("data-anchor-link");
    const anchorTarget = element?.getAttribute("data-anchor-target");

    if (!navElementId) {
      return;
    }

    const navDropdownElement = document.querySelector<HTMLElement>(
      `[aria-labelledby="${navElementId}"]`,
    );

    const navDropdownParentElement = document.getElementById(navElementId);

    if (!navDropdownElement || !navDropdownParentElement) {
      return;
    }

    const paddingLeft = Math.round(element?.getBoundingClientRect().left) + 12;

    const iconElement = document.querySelector<HTMLElement>(
      `[data-topnav-icon="${navElementId}"]`,
    );

    if (!iconElement) {
      return;
    }

    const toggleElement = document.querySelector<HTMLElement>(
      `[data-topnav-toggle-target="#collapseMenu"]`,
    );

    const navDropdownChildElements = Array.from(
      navDropdownElement.childNodes,
    ) as HTMLElement[];

    navDropdownChildElements.forEach((navDropdownChildElement) => {
      navDropdownChildElement.style.paddingLeft = `${paddingLeft}px`;
    });

    const showDropdown =
      navDropdownParentElement.getAttribute("data-show-dropdown");
    const isDropdownSelected =
      navDropdownElement.getAttribute("data-topnav-dropdown-selected") ===
      "true";
    navDropdownElement.setAttribute(
      "data-topnav-dropdown-selected",
      isDropdownSelected ? "false" : "true",
    );
    navDropdownParentElement.setAttribute(
      "data-show-dropdown",
      showDropdown === "true" ? "false" : "true",
    );
    iconElement.setAttribute(
      "data-topnav-icon-selected",
      isDropdownSelected ? "false" : "true",
    );
    if (isAnchorLink && anchorTarget) {
      window.location.hash = anchorTarget;
      if (this.isMobileDevice()) {
        window.dispatchEvent(
          new CustomEvent("hashchange", { detail: { withTimeOut: true } }),
        );
      } else {
        window.dispatchEvent(new Event("hashchange"));
      }
    }

    if (toggleElement && navToggle === "true" && this.isMobileDevice()) {
      this.handleTopNavToggleClick(toggleElement);
    }

    if (!isDropdownSelected) {
      this.closeOtherNavDropdowns(navElementId);
    }
  };

  public handleTopNavMegaMenuClick = (element: HTMLElement): void => {
    const navElementId = element?.getAttribute("id");
    const navToggle = element?.getAttribute("data-toggle-menu");
    const isAnchorLink = element?.getAttribute("data-anchor-link");
    const anchorTarget = element?.getAttribute("data-anchor-target");
    const navChildrenCount =
      element?.getAttribute("data-topnav-child-count") || "0";
    const isSubNav = element?.getAttribute("data-subnav") === "true";

    if (!navElementId) return;

    const navDropdownElement = document.querySelector<HTMLElement>(
      `[aria-labelledby="${navElementId}"]`,
    );
    const navDropdownParentElement = document.getElementById(navElementId);

    if (!navDropdownElement || !navDropdownParentElement) return;

    const parentRect = navDropdownParentElement.getBoundingClientRect();
    const availableSpace = window.innerWidth - parentRect.right;

    const paddingLeft =
      parseInt(navChildrenCount) > 20
        ? 0 // Math.round(Math.min(availableSpace, 150))
        : Math.round(element.getBoundingClientRect().left) - 10;

    const iconElement = document.querySelector<HTMLElement>(
      `[data-topnav-icon="${navElementId}"]`,
    );

    if (!iconElement) return;

    const navDropdownChildElements = Array.from(
      navDropdownElement.childNodes,
    ) as HTMLElement[];

    navDropdownChildElements.forEach((navDropdownChildElement) => {
      navDropdownChildElement.style.paddingLeft = `${paddingLeft}px`;
    });

    const showDropdown =
      navDropdownParentElement.getAttribute("data-show-dropdown");

    const isDropdownSelected =
      navDropdownElement.getAttribute(
        isSubNav
          ? "data-subnav-dropdown-selected"
          : "data-topnav-dropdown-selected",
      ) === "true";

    navDropdownElement.setAttribute(
      isSubNav
        ? "data-subnav-dropdown-selected"
        : "data-topnav-dropdown-selected",
      isDropdownSelected ? "false" : "true",
    );

    navDropdownParentElement.setAttribute(
      "data-show-dropdown",
      showDropdown === "true" ? "false" : "true",
    );

    iconElement.setAttribute(
      "data-topnav-icon-selected",
      isDropdownSelected ? "false" : "true",
    );

    if (isAnchorLink && anchorTarget) {
      window.location.hash = anchorTarget;
      window.dispatchEvent(new Event("hashchange"));
    }

    if (!isDropdownSelected) {
      this.closeOtherNavDropdowns(
        navElementId,
        isSubNav
          ? "data-subnav-dropdown-selected"
          : "data-topnav-dropdown-selected",
      );
    }
  };

  public closeOtherNavDropdowns = (
    clickedNavId: string,
    navDropDownSelector: string = "data-topnav-dropdown-selected",
    levelSelector: string = "data-nav-level",
  ): void => {
    const allNavDropdowns = document.querySelectorAll<HTMLElement>(
      `[${navDropDownSelector}="true"]`,
    );

    const clickedElement = document.getElementById(clickedNavId);
    const clickedLevel = clickedElement?.getAttribute(levelSelector);

    allNavDropdowns.forEach((navDropdown) => {
      const navId = navDropdown.getAttribute("aria-labelledby");
      const navDropdownLevel = navDropdown.getAttribute(levelSelector);
      const iconElement = document.querySelector<HTMLElement>(
        `[data-topnav-icon="${navId}"]`,
      );

      if (
        navId &&
        navId !== clickedNavId &&
        clickedLevel === navDropdownLevel
      ) {
        const navDropdownParentElement = document.getElementById(navId);

        if (navDropdownParentElement) {
          navDropdown.setAttribute(navDropDownSelector, "false");
          navDropdownParentElement.setAttribute("data-show-dropdown", "false");
        }

        if (iconElement) {
          iconElement.setAttribute("data-topnav-icon-selected", "false");
        }
      }
    });
  };

  public handleSliderInput(element: HTMLElement): void {
    const sliderElement = element?.getAttribute("data-slider-target");
    const sliderTargetElement = document.querySelector<HTMLElement>(
      `${sliderElement}`,
    );

    const sliderInputValue =
      element instanceof HTMLInputElement ? element.value : null;
    if (!sliderTargetElement || !sliderInputValue) {
      return;
    }
    sliderTargetElement.style.setProperty(
      "--slider-position",
      `${sliderInputValue}%`,
    );
  }

  public handleFaqAccordionClick(element: HTMLElement): void {
    const faqAccordionElement = element?.getAttribute("data-accordion-target");

    if (!faqAccordionElement) {
      return;
    }

    const faqAccordionTargetElement = document.querySelector<HTMLElement>(
      `${faqAccordionElement}`,
    );

    if (!faqAccordionTargetElement) {
      return;
    }

    const faqAccordionSelected =
      faqAccordionTargetElement.getAttribute("data-faq-selected");

    if (!faqAccordionSelected) {
      return;
    }

    return faqAccordionTargetElement.setAttribute(
      "data-faq-selected",
      faqAccordionSelected === "true" ? "false" : "true",
    );
  }

  public handleAccordionItemClick(element: HTMLElement): void {
    const accordionElement = element?.getAttribute("data-accordion-target");

    if (!accordionElement) {
      return;
    }

    const accordionTargetElement = document.querySelector<HTMLElement>(
      `${accordionElement}`,
    );

    if (!accordionTargetElement) {
      return;
    }

    const targetElementId = accordionTargetElement.getAttribute("id");

    if (!targetElementId) {
      return;
    }

    const accordionItemImageUrl = accordionTargetElement.getAttribute(
      "data-accordion-image-url",
    );

    const accordionStaticImageUrl = accordionTargetElement.getAttribute(
      "data-accordion-static-image-url",
    );
    const imageTargetSelected = accordionTargetElement.getAttribute(
      "data-accordion-image-target",
    );

    const parentId = accordionTargetElement.getAttribute("data-section-id");
    const parentAccordionElements = document.querySelectorAll<HTMLElement>(
      `[data-section-id="${parentId}"]`,
    );

    parentAccordionElements.forEach((openAccordion) => {
      let isSelected = openAccordion === accordionTargetElement;

      if (
        accordionTargetElement.getAttribute("data-accordion-selected") ===
        "true"
      ) {
        isSelected = false;
      }

      if (imageTargetSelected) {
        const accordionImageTargetElement =
          document.querySelector<HTMLElement>(imageTargetSelected);

        if (accordionImageTargetElement && isSelected) {
          const imageUrl = isSelected
            ? (accordionItemImageUrl || accordionStaticImageUrl)!
            : accordionStaticImageUrl!;

          if (!imageUrl) {
            return;
          }
          const imageElement = document.createElement("img");
          imageElement.setAttribute("src", imageUrl);
          imageElement.setAttribute("alt", "accordion image");
          accordionImageTargetElement.innerHTML = "";
          accordionImageTargetElement.appendChild(imageElement);
        }
      }

      return openAccordion.setAttribute(
        "data-accordion-selected",
        isSelected ? "true" : "false",
      );
    });
  }

  public handleSwiperTogglePlayClick(element: HTMLElement): void {
    const targetElement = element?.getAttribute("data-swiper-toggle-play");
    const targetElementId = document.querySelector(`#${targetElement}`) as any;
    const progressElement = document.querySelector<HTMLElement>(
      `[data-swiper-progress="${targetElement}"]`,
    );
    const processIconElement = document.querySelector<HTMLElement>(
      `[data-swiper-toogle-icon="${targetElement}"]`,
    );

    const play = processIconElement?.getAttribute("data-swiper-play-icon");
    const pause = processIconElement?.getAttribute("data-swiper-pause-icon");

    if (!targetElementId) {
      return;
    }

    const progressCircle = progressElement?.children[0] as HTMLElement;

    if (targetElementId.swiper) {
      if (targetElementId.swiper.autoplay.running) {
        targetElementId.swiper.autoplay.stop();
        processIconElement?.setAttribute("style", `--backgroundIcon: ${play}`);
        progressCircle.setAttribute("style", `opacity: 0;`);
      } else {
        targetElementId.swiper.autoplay.start();
        processIconElement?.setAttribute("style", `--backgroundIcon: ${pause}`);
        progressCircle.setAttribute("style", `opacity: 1; --timer: ${10};`);
      }
    }
  }

  public handleAnchorLinksStickySection(element: HTMLElement): void {
    if (!element) {
      return;
    }
    const anchorLinksContainer = document.querySelector<HTMLElement>(
      `[id="anchor-links-container"]`,
    );

    if (!anchorLinksContainer) {
      return;
    }

    const childDiv = element.children[0] as HTMLElement;
    if (!childDiv) {
      return;
    }

    const topNavHeight = this.getTopNavHeight();
    const childHeight = childDiv.getBoundingClientRect().height || 0;

    const totalHeight = topNavHeight - childHeight;

    const scrollTop = window.scrollY;
    const stickyThreshold =
      element.getBoundingClientRect().top + scrollTop - topNavHeight;

    const containerBottom =
      anchorLinksContainer.getBoundingClientRect().bottom +
      scrollTop -
      totalHeight;

    if (scrollTop > stickyThreshold && scrollTop <= containerBottom) {
      childDiv.style.cssText = `
      position: fixed;
      top: ${topNavHeight}px;
      left: 0;
      z-index: 1000;
      background-color: #fff;
      width: 100%;
      box-shadow: 4px 4px 20px rgb(0 0 0 / 5%);
    `;
    } else {
      childDiv.style.cssText = "";
    }
  }

  public scrollToAnchor(
    target: string,
    isRouterLink: boolean = false,
    withTimeOut: boolean = false,
  ): void {
    const anchor = target.replace("#", "");
    if (anchor.includes("&") || anchor.includes("=")) return;
    const isMobile = this.isMobileDevice();
    const targetElementId = isMobile
      ? `[data-anchor-mobile-id="${anchor}"]`
      : `[data-anchor-id="${anchor}"]`;

    const targetElement =
      document.querySelector<HTMLElement>(targetElementId) ||
      document.querySelector<HTMLElement>(`[data-anchor-id="${anchor}"]`);

    if (!targetElement) {
      return;
    }
    this.handleEventTabClick(targetElement, false);
    const isEventTab = targetElement.getAttribute("data-event-tab");

    const isFootNote = targetElement.getAttribute("data-footnote");

    const anchorLink = document.querySelector<HTMLElement>(
      `[id="anchor-links-sticky-section"]`,
    );

    const childDiv = anchorLink?.children[0] as HTMLElement;

    const topNavHeight = this.getTopNavHeight();
    const childHeight = childDiv?.getBoundingClientRect().height || 0;
    const totalHeight = childHeight + topNavHeight;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = targetElement.getBoundingClientRect().top;
    let offsetPosition = elementRect - bodyRect - totalHeight;

    if (isFootNote) {
      offsetPosition = offsetPosition - 30;
    }

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    if (isEventTab) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }

    if (withTimeOut) {
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 200);
    }

    if (isRouterLink) {
      this.routerPush(target);
    }
  }

  public closeAllNavDropdowns = (skipToggle: boolean = false): void => {
    const dropdownAttributes = [
      "data-topnav-dropdown-selected",
      "data-subnav-dropdown-selected",
    ];

    dropdownAttributes.forEach((attr) => {
      if (this.isMobileDevice()) {
        return;
      }
      const dropdowns = document.querySelectorAll<HTMLElement>(
        `[${attr}="true"]`,
      );
      dropdowns.forEach((dropdown) => {
        dropdown.setAttribute(attr, "false");

        const navId = dropdown.getAttribute("aria-labelledby");
        const parentElement = document.getElementById(navId || "");
        const iconElement = document.querySelector<HTMLElement>(
          `[data-topnav-icon="${navId}"]`,
        );

        if (parentElement) {
          parentElement.setAttribute("data-show-dropdown", "false");
        }

        if (iconElement) {
          iconElement.setAttribute("data-topnav-icon-selected", "false");
        }
      });
    });

    if (this.isMobileDevice() && !skipToggle) {
      const toggleElement = document.querySelector<HTMLElement>(
        `[data-topnav-toggle-target="#collapseMenu"]`,
      );
      if (toggleElement) {
        this.handleTopNavToggleClick(toggleElement);
      }
    }
  };

  public handleAnchorLinkClick(element: HTMLElement): void {
    const target = element?.getAttribute("data-anchor-target");
    const navAnchor = element?.getAttribute("data-nav-anchor-item");
    if (!target) {
      return;
    }
    const isRouterLink = element?.getAttribute("data-router-link");
    this.scrollToAnchor(target, isRouterLink === "true");

    if (navAnchor) {
      this.closeAllNavDropdowns();
    }
  }

  public handleCounterElement(counterElement: HTMLElement) {
    let startValue = 0;
    const interval = 1000;
    const counterValue = counterElement.getAttribute("data-counter-value");
    const counterValueNumber = parseInt(counterValue || "0");

    const duration = Math.floor(interval / counterValueNumber);

    const unobserve = observe(
      counterElement,
      (visible: boolean) => {
        if (visible) {
          const counter = setInterval(() => {
            if (startValue <= counterValueNumber) {
              counterElement.innerHTML = startValue.toString();
              startValue++;
            } else {
              clearInterval(counter);
            }
          }, duration);

          return () => {
            clearInterval(counter);
            unobserve();
          };
        }
      },
      {},
    );

    return () => {
      unobserve();
    };
  }

  public handleTealiumEventClick(el: HTMLElement): void {
    const eventName = el?.getAttribute("data-tealium-event");
    const parentElement = el?.getAttribute("data-parent-id");
    const targetElement = document?.querySelector<HTMLElement>(
      `#${parentElement}`,
    );
    const targetElementHref = targetElement?.getAttribute("href");

    let url = el?.getAttribute("data-href");
    if (targetElementHref !== url && targetElementHref) {
      url = targetElementHref;
    }
    const target = el?.getAttribute("data-target") || "_blank";

    if (eventName === "download" || eventName === "external") {
      if (url) {
        window.open(url, target);
      }
    } else if (eventName === "mail" || eventName === "tel") {
      if (url) {
        window.location.href = url;
      }
    }
  }

  public handleTabClick(el: HTMLElement, isMobile: boolean = false): void {
    const tabTarget = el?.getAttribute("data-tab-target-content");
    const tabClintId = el?.getAttribute("data-tab-clnt-id");
    const tabElements = isMobile
      ? document.querySelectorAll<HTMLElement>(`[data-tab-toggle="modal"]`)
      : document.querySelectorAll<HTMLElement>(
          `[data-tab-clnt-id="${tabClintId}"]`,
        );

    const tabContentElements = document.querySelectorAll<HTMLElement>(
      `[data-content-clnt-id="${tabClintId}"]`,
    );

    if (!tabTarget) {
      return;
    }
    const tabTargetElement = document.querySelector<HTMLElement>(
      `${tabTarget}`,
    );

    if (!tabTargetElement) {
      return;
    }

    tabElements?.forEach((tabElement) => {
      const tabElementTarget = tabElement.getAttribute(
        "data-tab-target-content",
      );
      const isSelected = tabElementTarget === tabTarget;
      return tabElement.setAttribute("data-tab-selected", `${isSelected}`);
    });

    tabContentElements?.forEach((tabContentElement) => {
      const isSelected = tabContentElement === tabTargetElement;
      return tabContentElement.setAttribute(
        "data-tab-hidden",
        `${!isSelected}`,
      );
    });
  }

  public handleEventTabClick(
    el: HTMLElement,
    isRouterLink: boolean = true,
  ): void {
    const eventTabTarget = el?.getAttribute("data-event-tab-target-content");
    const eventTabClintId = el?.getAttribute("data-event-tab-clnt-id");
    const eventTabElements = document.querySelectorAll<HTMLElement>(
      `[data-event-tab-clnt-id="${eventTabClintId}"]`,
    );
    const routerLink = el?.getAttribute("data-nav-anchor-id");

    const eventTabContentElements = document.querySelectorAll<HTMLElement>(
      `[data-event-content-clnt-id="${eventTabClintId}"]`,
    );

    if (!eventTabTarget) {
      return;
    }
    const eventTabTargetElement = document.querySelector<HTMLElement>(
      `${eventTabTarget}`,
    );

    if (!eventTabTargetElement) {
      return;
    }

    eventTabElements?.forEach((eventTabElement) => {
      const eventTabElementTarget = eventTabElement.getAttribute(
        "data-event-tab-target-content",
      );
      const isSelected = eventTabElementTarget === eventTabTarget;
      return eventTabElement.setAttribute("data-tab-selected", `${isSelected}`);
    });

    eventTabContentElements?.forEach((eventTabContentElement) => {
      const isSelected = eventTabContentElement === eventTabTargetElement;
      return eventTabContentElement.setAttribute(
        "data-event-tab-hidden",
        `${!isSelected}`,
      );
    });

    if (routerLink && isRouterLink) {
      this.routerPush(`#${routerLink}`);
    }
  }

  public handleModalTabClick(
    modalData: HTMLElement,
    setModalData: (data: HTMLElement) => void,
    setShowModal: (show: boolean) => void,
  ): void {
    let cloneModalData = modalData.cloneNode(true) as HTMLElement;
    if (!cloneModalData) return;
    const sliderElements = cloneModalData.querySelectorAll(
      '[data-slider="true"]',
    );

    sliderElements.forEach((sliderElement) => {
      const targetSlider = sliderElement?.getAttribute("data-slider-target");
      const sliderTargetElement = cloneModalData.querySelector<HTMLElement>(
        `${targetSlider}`,
      );
      sliderElement?.setAttribute(
        "data-slider-target",
        `${targetSlider}_modal`,
      );
      sliderTargetElement?.removeAttribute("id");
      sliderTargetElement?.setAttribute(
        "id",
        `${targetSlider?.replace("#", "")}_modal`,
      );
    });

    setModalData(cloneModalData);
    setShowModal(true);
  }

  public handleGeoAccordionClick(element: HTMLElement): void {
    const geoAccordionElement = element?.getAttribute("data-geo-target");

    if (!geoAccordionElement) {
      return;
    }

    const geoAccordionTargetElement = document.querySelector<HTMLElement>(
      `${geoAccordionElement}`,
    );

    if (!geoAccordionTargetElement) {
      return;
    }

    const geoAccordionElements =
      document.querySelectorAll<HTMLElement>(`[data-geo-selected]`);

    geoAccordionElements.forEach((accordionElement) => {
      const isSelected = accordionElement === geoAccordionTargetElement;
      return accordionElement.setAttribute(
        "data-geo-selected",
        `${isSelected}`,
      );
    });
  }

  public handleTrustArcClick(element: HTMLElement): void {
    if (typeof window.truste !== "undefined") {
      window.truste.eu.clickListener(1);
    }
  }

  // // use a callback prop to load the script and link element
  // public addCalendlyWidget(onLoad?: () => void) {
  //   let linkElement = document.getElementById(
  //     "calendly-link",
  //   ) as HTMLLinkElement;
  //   let scriptElement = document.getElementById(
  //     "calendly-script",
  //   ) as HTMLScriptElement;

  //   if (linkElement || scriptElement) {
  //     return;
  //   }
  //   linkElement = document.createElement("link");
  //   linkElement.id = "calendly-link";
  //   linkElement.rel = "stylesheet";
  //   linkElement.href = "https://assets.calendly.com/assets/external/widget.css";
  //   document.head.appendChild(linkElement);

  //   scriptElement = document.createElement("script");
  //   scriptElement.id = "calendly-script";
  //   scriptElement.src = "https://assets.calendly.com/assets/external/widget.js";
  //   scriptElement.type = "text/javascript";
  //   scriptElement.async = true;
  //   if (onLoad) {
  //     scriptElement.onload = onLoad;
  //   }
  //   document.head.appendChild(scriptElement);
  // }

  public loadCalendlyAssets(onLoad?: () => void) {
    const existingScript = document.getElementById(
      "calendly-script",
    ) as HTMLScriptElement | null;

    if (existingScript) {
      // Already loaded or loading
      if (window.Calendly && onLoad) {
        onLoad();
      } else if (onLoad) {
        existingScript.addEventListener("load", onLoad, { once: true });
      }
      return;
    }

    // Inject CSS once
    if (!document.getElementById("calendly-link")) {
      const link = document.createElement("link");
      link.id = "calendly-link";
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    // Inject script
    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    if (onLoad) {
      script.onload = onLoad;
    }

    document.head.appendChild(script);
  }

  public removeCalendlyWidget() {
    const linkElement = document.getElementById("calendly-link");
    const scriptElement = document.getElementById("calendly-script");

    if (linkElement) {
      linkElement.remove();
    }

    if (scriptElement) {
      scriptElement.remove();
    }
  }

  public handleCalendlyClick(element: HTMLElement): void {
    const href = element?.getAttribute("data-href");

    if (!href) return;

    if (window.Calendly && window.Calendly.initPopupWidget) {
      // console.log("Calendly Clicked", href);
      window.Calendly.initPopupWidget({
        url: href,
        prefill: {},
        utm: {},
      });
    } else {
      window.open(href, "_blank");
    }
  }

  // validator escape string
  public validatorEscape(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\//g, "&#x2F;")
      .replace(/\\/g, "&#x5C;")
      .replace(/`/g, "&#96;");
  }

  // validator unescape string
  public validatorUnescape(str: string): string {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x2F;/g, "/")
      .replace(/&#x5C;/g, "\\")
      .replace(/&#96;/g, "`")
      .replace(/&amp;/g, "&");
  }

  // token replace fallback
  // public tokenReplace(str: string, labelMap: LabelMap): string {
  //   let newStr = "";
  //   const tokens = str.split("{label:");
  //   for (let i = 1; i < tokens.length; i++) {
  //     newStr += labelMap[tokens[i].substring(0, tokens[i].search("}"))];
  //     newStr += tokens[i].substring(tokens[i].search("}") + 1);
  //   }
  //   return newStr;
  // }
}

const inst = new DomUtility();
export default inst;
