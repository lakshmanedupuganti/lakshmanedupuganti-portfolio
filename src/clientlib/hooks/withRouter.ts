"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export const usePageTracking = (updateReferrerOnRouterPush: boolean) => {
  const router = useRouter();
  useEffect(() => {
    const routeChangeCompleted = (url: string) => {
      // TODO page load tracking
    };

    const routerChangeStarted = (url: string) => {
      if (updateReferrerOnRouterPush) {
        try {
          const prevUrl = (document.location.href || "").split("#")[0] || "";
          try {
            Object.defineProperty(document, "referrer", {
              value: prevUrl,
              writable: true,
            });
          } catch (ee) {}
          (document as any).referrer = prevUrl;
        } catch (e) {
          console.log(e);
        }
      }
    };
    router.events.on("routeChangeComplete", routeChangeCompleted);
    router.events.on("routeChangeStart", routerChangeStarted);
    return () => {
      router.events.off("routeChangeComplete", routeChangeCompleted);
      router.events.off("routeChangeStart", routerChangeStarted);
    };
  });
};
