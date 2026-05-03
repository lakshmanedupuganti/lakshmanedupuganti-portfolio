"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Swiper from "swiper";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import util from "@clientlib/utility";

export interface SwiperConfig {
  clientId: string;
  modules?: any[];
  navigation?: {
    nextEl?: string;
    prevEl?: string;
  };
  pagination?: {
    el?: string;
    clickable?: boolean;
  };
  autoplay?: {
    delay?: number;
    disableOnInteraction?: boolean;
  };
  breakpoints?: Record<number, any>;
  speed?: number;
  spaceBetween?: number;
  initialSlide?: number;
  resizeObserver?: boolean;
  updateOnWindowResize?: boolean;
  onSlideChange?: (swiper: Swiper) => void;
  onInit?: (swiper: Swiper) => void;
  onTransitionStart?: (swiper: Swiper) => void;
  onTransitionEnd?: (swiper: Swiper) => void;
  onBeforeInit?: (swiper: Swiper) => void;
}

export interface SwiperProgressConfig {
  enabled?: boolean;
  delay?: number;
}

export const useSwiper = (
  config: SwiperConfig,
  progressConfig?: SwiperProgressConfig
) => {
  const swiperRef = useRef<Swiper | null>(null);
  const swiperInstalledRef = useRef(false);
  const [progress, setProgress] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    clientId,
    modules = [Navigation, Pagination, Scrollbar],
    navigation,
    pagination,
    autoplay,
    breakpoints,
    speed = 500,
    spaceBetween = 0,
    initialSlide = 0,
    resizeObserver = true,
    updateOnWindowResize = true,
    onSlideChange,
    onInit,
    onTransitionStart,
    onTransitionEnd,
    onBeforeInit,
  } = config;

  const { enabled: progressEnabled = false, delay: progressDelay = 10 } =
    progressConfig || {};

  // Handle mobile detection
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 800;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Initialize swiper
  useEffect(() => {
    if (!clientId || swiperInstalledRef.current) return;

    const rootId = `root_${clientId}`;
    const node = document.getElementById(rootId);

    if (!node) return;

    // Remove root class pattern
    util.removeClassByPattern(node, /root/i);

    // Create swiper configuration
    const swiperConfig: any = {
      modules,
      speed,
      initialSlide,
      spaceBetween,
      resizeObserver,
      updateOnWindowResize,
      ...(breakpoints && { breakpoints }),
      ...(navigation && { navigation }),
      ...(pagination && { pagination }),
      ...(autoplay && { autoplay }),
      on: {
        ...(onInit && { init: onInit }),
        ...(onSlideChange && { slideChange: onSlideChange }),
        ...(onTransitionStart && { transitionStart: onTransitionStart }),
        ...(onTransitionEnd && { transitionEnd: onTransitionEnd }),
        ...(onBeforeInit && { beforeInit: onBeforeInit }),
        ...(progressEnabled && {
          init: () => setProgress(true),
          transitionStart: () => setProgress(false),
          transitionEnd: () => setProgress(true),
        }),
      },
    };

    try {
      const swiper = new Swiper(node, swiperConfig);
      swiperRef.current = swiper;
      swiperInstalledRef.current = true;

      return () => {
        try {
          if (swiper) {
            swiper.destroy();
            swiperRef.current = null;
          }
        } catch (error) {
          console.error("Error destroying Swiper:", error);
        } finally {
          swiperInstalledRef.current = false;
        }
      };
    } catch (error) {
      console.error("Error initializing Swiper:", error);
    }
  }, [clientId, isMobile, progressEnabled]);

  // Handle progress indicator
  useEffect(() => {
    if (!progressEnabled || !clientId) return;

    const progressElement = document.querySelector(
      `[data-swiper-progress="root_${clientId}"]`
    );

    if (!progressElement) return;

    const progressCircle = progressElement.children[0] as HTMLElement;
    if (!progressCircle) return;

    if (progress) {
      progressCircle.setAttribute(
        "style",
        `opacity: 1; --timer: ${progressDelay};`
      );
    } else {
      progressCircle.setAttribute("style", `opacity: 0;`);
    }
  }, [progress, clientId, progressEnabled, progressDelay]);

  // Handle slide index updates
  const updateSlideIndex = useCallback(
    (index: number) => {
      const nodeElement = document.querySelector(
        `[data-swiper-index="${clientId}"]`
      );
      if (nodeElement) {
        nodeElement.innerHTML = (index + 1).toString();
      }
    },
    [clientId]
  );

  // Handle slide initialization
  const initializeSlides = useCallback(
    (slideInitId: string, className: string = "swiper-slide") => {
      const nodeSlideInit = document.querySelectorAll(`#${slideInitId}`);
      util.addClassToElements(nodeSlideInit, className);
    },
    []
  );

  // Handle resize for slides
  const handleSlideResize = useCallback(
    (slideInitId: string, className: string = "swiper-slide") => {
      util.resizeHandler(slideInitId, className);
    },
    []
  );

  return {
    swiper: swiperRef.current,
    isMobile,
    updateSlideIndex,
    initializeSlides,
    handleSlideResize,
  };
};
