"use client";

import { useCallback, useEffect, useRef } from "react";
import domUtil from "@clientlib/utility/domUtility";
import cookieUtil from "@clientlib/utility/cookie";
import {
  ClientContentItemComponentProps,
  PageViewData,
  SiteConfigEx,
} from "@src/lib/types";

interface GlobalUseEffectHandlerProps extends ClientContentItemComponentProps {}

interface CustomHashChangeEventDetail {
  withTimeOut?: boolean;
}

type CustomHashChangeEvent = HashChangeEvent &
  CustomEvent<CustomHashChangeEventDetail>;

const GlobalUseEffectHandler: React.FC<GlobalUseEffectHandlerProps> = (
  props,
) => {
  const { site, localeId } = props.pageResult || {};
  const { locales } = (site as SiteConfigEx) || {};
  const currentLocale = locales?.find((l) => l.id === localeId);
  const previousUrlRef = useRef<string>("");
  const slugPrefix = currentLocale?.slugPrefix;
  const siteDomain = site?.domain;

  // Track consumer to provider navigation
  const trackConsumerToProviderNavigation = useCallback(() => {
    // Only proceed if referrer is not empty and is a valid URL
    if (!previousUrlRef.current || previousUrlRef.current === "") {
      return;
    }

    try {
      const referrerDomain = new URL(previousUrlRef.current).hostname;
      const regex = new RegExp(`^https?:\\/\\/[^/]+\\/${slugPrefix}(\\/.*)?$`);
      const alreadyTracked = sessionStorage.getItem(
        "consumerToProviderTracked",
      );
      if (alreadyTracked) {
        return;
      }

      if (
        window.dataLayer &&
        referrerDomain === siteDomain &&
        slugPrefix &&
        !regex.test(previousUrlRef.current)
      ) {
        const navigationEvent = {
          event: "navigation_between_sites",
          previousUrl: document.referrer,
          nav_type: "consumer_to_provider_marketing",
        };
        window.dataLayer.push(navigationEvent);
        sessionStorage.setItem("consumerToProviderTracked", "true");
      }
    } catch (error) {
      // Silently handle invalid URL errors
      console.warn("Invalid referrer URL:", error);
    }
  }, [siteDomain, slugPrefix]);

  const hasAnalyticsConsent = (): boolean => {
    try {
      const prefCookie = window?.truste?.eu?.bindMap?.prefCookie;

      if (prefCookie) {
        return prefCookie.split(",").includes("1");
      }

      return false;
    } catch {
      return false;
    }
  };

  // push page view to google analytics
  const pushPageViewToGoogleAnalytics = useCallback(
    (currentUrl: string, pageTitle: string) => {
      try {
        if (!window.dataLayer) return;

        // Use prefCookie-based consent to check if analytics consent is given
        // if (!hasAnalyticsConsent()) return;

        const pageViewData: PageViewData = {
          event: "page_view",
          pageUrl: currentUrl,
          pageTitle,
          previousUrl: previousUrlRef.current,
        };

        window.dataLayer.push(pageViewData);

        // Update session storage with current URL
        sessionStorage.setItem("previousUrl", currentUrl);
        previousUrlRef.current = currentUrl;
      } catch (error) {
        console.warn("Failed to push page view to Google Analytics:", error);
      }
    },
    [],
  );

  // handle page navigation and analytics
  const handlePageNavigation = useCallback(() => {
    const currentUrl = window.location.href;
    const pageTitle = document.title;

    pushPageViewToGoogleAnalytics(currentUrl, pageTitle);
    // Scroll to top if no hash, otherwise let hash handling manage scroll
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pushPageViewToGoogleAnalytics]);

  // handle hash change events and scrolls to the relevant anchor
  const handleHashChange = useCallback((e?: CustomHashChangeEvent) => {
    try {
      const anchor = window.location.hash.slice(1);
      const withTimeOut = e?.detail?.withTimeOut ?? false;

      if (anchor) {
        domUtil.scrollToAnchor(anchor, false, withTimeOut);
      }
    } catch (error) {
      console.warn("Failed to handle hash change:", error);
    }
  }, []);

  // initialize DOM elements based on data attributes and cookies
  const initializeElements = useCallback(() => {
    try {
      // Handle counter elements
      const counterElements =
        document.querySelectorAll<HTMLElement>("[data-counter]");
      counterElements.forEach(domUtil.handleCounterElement);

      // Handle promo banner
      const promoBannerDismissed = cookieUtil.getCookie("promoBannerDismissed");
      if (promoBannerDismissed) {
        const promoBanner = document.getElementById("promo-banner");
        if (promoBanner) {
          promoBanner.classList.add("d-none");
        }
      }

      // Handle Calendly elements
      const calendlyElements =
        document.querySelectorAll<HTMLElement>("[data-calendly]");
      if (calendlyElements.length > 0) {
        domUtil.loadCalendlyAssets();
      } else {
        domUtil.removeCalendlyWidget();
      }

      // Initialize URL parameter cookies
      cookieUtil.initURLParamsCookies();
    } catch (error) {
      console.warn("Failed to initialize elements:", error);
    }
  }, []);

  // handle scroll events for sticky anchor links
  const handleScroll = useCallback(() => {
    try {
      const anchorLinksElement = document.getElementById(
        "anchor-links-sticky-section",
      ) as HTMLElement;
      if (anchorLinksElement) {
        domUtil.handleAnchorLinksStickySection(anchorLinksElement);
      }
    } catch (error) {
      console.warn("Failed to handle scroll:", error);
    }
  }, []);

  // Effect for page navigation and analytics
  useEffect(() => {
    // Retrieve previous URL from sessionStorage (if available), otherwise use document.referrer
    previousUrlRef.current =
      sessionStorage.getItem("previousUrl") || document.referrer;
    trackConsumerToProviderNavigation();
    handlePageNavigation();
  }, [handlePageNavigation, trackConsumerToProviderNavigation]);

  // Effect for hash change handling
  useEffect(() => {
    // Handle initial hash on mount
    handleHashChange();

    // Add event listener for hash changes
    const hashChangeHandler = (e: Event) =>
      handleHashChange(e as CustomHashChangeEvent);
    window.addEventListener("hashchange", hashChangeHandler);

    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, [handleHashChange]);

  // Effect for element initialization
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeElements();
    }, 0);

    return () => clearTimeout(timer);
  }, [initializeElements]);

  // Effect for scroll handling
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return null;
};

export default GlobalUseEffectHandler;
