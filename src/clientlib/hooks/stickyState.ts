"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare type StickyStates = "static" | "sticky-hidden" | "sticky-visible";

declare type StickyStateParams = {
  scrollUpThreshold?: number;
  scrollDownThreshold?: number;
  containerRef?: React.RefObject<HTMLElement>;
  keepAlwaysVisible?: boolean;
  offsetElementSelector?: string;
};

export const useStickyState = (parms: StickyStateParams): StickyStates => {
  const {
    scrollUpThreshold = 5,
    scrollDownThreshold = 1,
    containerRef = null,
    keepAlwaysVisible = false,
    offsetElementSelector = "",
  } = parms;
  const currState = useRef<StickyStates>("static");
  const prevScrollPos = useRef<number>(0);
  const [state, setState] = useState<StickyStates>("static");

  const updateState = (val: StickyStates) => {
    if (currState.current !== val) {
      currState.current = val;
      setState(val);
    }
  };

  const callback = useCallback(() => {
    let y = window.pageYOffset;

    if (offsetElementSelector) {
      const offsetBoundingClientRect = document
        .querySelector(offsetElementSelector)
        ?.getBoundingClientRect() || { top: 0, height: 0 };
      const offset =
        Math.max(
          offsetBoundingClientRect?.top,
          -1 * offsetBoundingClientRect?.height
        ) + offsetBoundingClientRect?.height;
      y = y + offset;
      if (containerRef?.current) {
        (
          containerRef.current.children.item(0) as HTMLElement
        ).style.top = `${Math.max(
          offsetBoundingClientRect.height + offsetBoundingClientRect.top,
          0
        )}px`;
      }
    }

    const diff = y - prevScrollPos.current;
    prevScrollPos.current = y;

    const origPos = containerRef?.current
      ? containerRef.current.getBoundingClientRect().top + window.pageYOffset
      : 0;

    if (y <= origPos) {
      updateState("static");
    } else if (diff <= -scrollUpThreshold || keepAlwaysVisible) {
      updateState("sticky-visible");
    } else if (diff >= scrollDownThreshold) {
      if (currState.current === "sticky-visible") {
        updateState("sticky-hidden");
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", callback);
    return () => {
      window.removeEventListener("scroll", callback);
    };
  }, []);

  return state;
};
