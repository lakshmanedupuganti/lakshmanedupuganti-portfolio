"use client";

import { useState, useEffect } from "react";
import cookie from "@clientlib/utility/cookie";

/**
 * The userId is determined by:
 * 1. URL parameter 'user_id' (highest priority)
 * 2. Existing '_provider_id' cookie
 * 3. Newly generated random ID (fallback)
 */

export const useUserId = (
  urlParams?: Record<string, any> | null
): string | null => {
  const [userId, setUserId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 12);

  useEffect(() => {
    if (urlParams?.user_id) {
      setUserId(urlParams.user_id as string);
      cookie.putCookie("_provider_id", urlParams.user_id, {
        expires: 1,
        expiresUnit: "year",
        path: "/",
      });
    } else if (!userId) {
      const cookieId = cookie.getCookie("_provider_id") as string;
      const id = cookieId || generateId();
      setUserId(id);

      if (!cookieId) {
        cookie.putCookie("_provider_id", id, {
          expires: 1,
          expiresUnit: "year",
          path: "/",
        });
      }
    }
  }, [urlParams, userId]);

  return userId;
};
