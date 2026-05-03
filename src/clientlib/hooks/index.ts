"use client";

import { useEffect, useCallback } from "react";

export const useOnClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
) => {
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendant elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      memoizedHandler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, memoizedHandler]); // Add ref and memoizedHandler to effect dependencies
};

export { useSwiper } from "@clientlib/hooks/useSwiper";
