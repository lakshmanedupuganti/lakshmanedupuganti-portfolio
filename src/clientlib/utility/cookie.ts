"use client";

import clientUtil from "@clientlib/utility";

export type TimeUnit =
  | "ms"
  | "sec"
  | "min"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";
export type SameSiteTypes = "None" | "Lax" | "Strict";

export interface PutCookieOptions {
  expires?: number | Date;
  expiresUnit?: TimeUnit;
  path?: string;
  sameSite?: SameSiteTypes;
  customDomain?: string;
}

export interface AcceptCookieData {
  accepted: boolean;
  allowCategory: [boolean, boolean, boolean, boolean];
}

export interface UTMCookieData {
  utm_campaign: string | null;
  utm_content: string | null;
  utm_medium: string | null;
  utm_source: string | null;
  utm_term: string | null;
}

export interface GCLIDCookieData {
  gclid: string | null;
}

export interface PromoCookieData {
  promo: string | null;
}

const timeUnit: { [key: string]: number } = {
  ms: 1,
  sec: 1000,
  min: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 7 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
};

const _acceptCookieName = "cookiesDirective";
const _userVisitedCookieName = "userVisited";

class CookieUtility {
  private cookieMap: Record<string, string> = {};
  private userVisited?: boolean;

  constructor() {
    if (process.browser) {
      document.cookie.split("; ").forEach((v) => {
        let [key, value] = v.split("=");
        if (key && value) {
          try {
            this.cookieMap[key] = decodeURIComponent(value);
          } catch (e) {
            try {
              this.cookieMap[key] = unescape(value);
            } catch (ee) {}
          }
        }
      });
    }
  }

  public getCookie(name: string): string | undefined {
    return this.cookieMap[name];
  }

  public getCookieAsJson<T = any>(name: string): T | undefined {
    const value = this.cookieMap[name];
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        //do nothing
      }
    }
    return undefined;
  }

  public putCookie<T = string>(
    name: string,
    value: T,
    options?: PutCookieOptions
  ): boolean {
    let {
      expires = 0,
      expiresUnit = "day",
      path = "/",
      sameSite = "Lax",
      customDomain,
    } = options || {};

    const secure = window.location.protocol === "https:";
    if (sameSite === "None" && !secure) {
      sameSite = "Lax";
    }

    const date = new Date();
    let timeInMs = timeUnit[expiresUnit as string] * (expires as number);
    date.setTime(date.getTime() + timeInMs);

    let strValue = "";
    try {
      strValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
    } catch (e) {
      return false;
    }
    document.cookie = `${name}=${strValue}; expires=${
      timeInMs > 0 ? date.toUTCString() : ""
    }; path=${path}; SameSite=${sameSite}${secure ? "; Secure" : ""} ${
      customDomain ? "; domain=" + customDomain : ""
    }`;

    this.cookieMap[name] = strValue;
    return true;
  }

  public getDefaultAcceptCookieData = (): AcceptCookieData => ({
    accepted: false,
    allowCategory: [true, false, false, false],
  });

  public getPreviewMode(): boolean {
    return !!this.getCookie("previewMode");
  }

  public setPreviewMode(val: boolean) {
    this.putCookie("previewMode", val ? "1" : "");
  }

  public getVisitorId(): string {
    let savedId = this.getCookie("vid");
    if (savedId) {
      return savedId;
    }
    savedId = clientUtil.generateClientShortGuid();
    this.putCookie("vid", savedId, { expires: 5, expiresUnit: "year" });
    return savedId;
  }

  public getSetUserVisited(): boolean {
    let ret = this.getCookie(_userVisitedCookieName);
    const visited = ret === "yes";
    if (!visited) {
      this.putCookie(_userVisitedCookieName, "yes", { path: "/" });
    }
    if (this.userVisited === undefined) {
      this.userVisited = visited;
    }
    return this.userVisited;
  }

  public getUserVisited(): boolean {
    return this.getCookie(_userVisitedCookieName) === "yes";
  }

  public getAcceptCookieData(): AcceptCookieData {
    let data = this.getDefaultAcceptCookieData();
    let cookie = this.getCookie(_acceptCookieName);

    if (!cookie) {
      return data;
    }

    let dataItems = cookie.split("|");
    if (dataItems[0] === "accepted") {
      data.accepted = true;
      data.allowCategory.forEach((d, idx) => (data.allowCategory[idx] = true));
    }
    for (let i = 1; i < dataItems.length; i++) {
      if (clientUtil.isNumber(dataItems[i])) {
        const num = parseInt(dataItems[i]);
        if (num > 0 && num < data.allowCategory.length) {
          data.allowCategory[num] = false;
        }
      }
    }
    return data;
  }

  public setAcceptCookieData(data: AcceptCookieData) {
    const arr = [data.accepted ? "accepted" : "notaccepted"];

    if (data.accepted) {
      for (let i = 1; i < data.allowCategory.length; i++) {
        if (data.allowCategory[i] === false) {
          arr.push("" + i);
        }
      }
    }
    let s = arr.join("|");
    this.putCookie(_acceptCookieName, s, {
      expires: 2,
      expiresUnit: "year",
      sameSite: "None",
    });
  }

  public setCookieAccepted(
    accepted: boolean,
    allowCategory: [boolean, boolean, boolean]
  ) {
    let data = this.getDefaultAcceptCookieData();
    data.accepted = accepted;
    if (allowCategory && allowCategory.length) {
      for (let i = 0; i < allowCategory.length; i++) {
        data.allowCategory[i + 1] = !!allowCategory[i];
      }
    }
    this.setAcceptCookieData(data);
  }

  public setFunctionalCookieValue(value: boolean) {
    this.putCookie("functionalCookie", value, {
      expires: 2,
      expiresUnit: "year",
      sameSite: "None",
    });
  }

  public shouldShowAcceptPopup(): boolean {
    return !this.getAcceptCookieData().accepted;
  }

  public checkUseScript(checkCategory: number | undefined = undefined) {
    if (!this.checkCookiesEnabled()) {
      return true;
    }
    let data = this.getAcceptCookieData();
    if (!data.accepted) {
      return false;
    }

    if (checkCategory === undefined) {
      return !data.allowCategory.some((c) => !c);
    }
    return !!data.allowCategory[checkCategory];
  }

  public checkCookiesEnabled(): boolean {
    return window.navigator.cookieEnabled !== false;
  }

  private extractUTMParams(
    urlParams: URLSearchParams,
    keys: readonly string[]
  ): Record<string, string> {
    return keys.reduce(
      (params, key) => {
        const value = urlParams.get(key);
        if (value) {
          params[key] = value;
        }
        return params;
      },
      {} as Record<string, string>
    );
  }

  public initUTMCookie() {
    const UTM_KEYS = [
      "utm_campaign",
      "utm_content",
      "utm_medium",
      "utm_source",
      "utm_term",
    ] as const;
    const urlParams = new URLSearchParams(window.location.search);
    const domain = window.location.hostname;
    const utmParams = this.extractUTMParams(urlParams, UTM_KEYS);
    if (Object.keys(utmParams).length) {
      this.putCookie("utmParams", JSON.stringify(utmParams), {
        path: "/",
        expires: 180,
        expiresUnit: "day",
        customDomain: domain.replace(/^www\./, ""),
      });
    }
  }

  public getUTMCookie(): UTMCookieData | undefined {
    return this.getCookieAsJson<UTMCookieData>("utmParams");
  }

  public initGCLIDCookie() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = this.extractUTMParams(urlParams, ["gclid"]);
    const domain = window.location.hostname;

    if (Object.keys(utmParams).length) {
      const parms = {
        gclid: utmParams.gclid,
      };
      this.putCookie("gclidParams", JSON.stringify(parms), {
        expires: 180,
        expiresUnit: "day",
        customDomain: domain.replace(/^www\./, ""),
      });
    }
  }

  public getGCLIDCookie(): GCLIDCookieData | undefined {
    return this.getCookieAsJson<GCLIDCookieData>("gclidParams");
  }
  public initPromoCookie() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = this.extractUTMParams(urlParams, ["promo"]);
    const domain = window.location.hostname;

    if (Object.keys(utmParams).length) {
      const parms = {
        promo: utmParams.promo,
      };
      this.putCookie("promoParam", JSON.stringify(parms), {
        expires: 180,
        expiresUnit: "day",
        customDomain: domain.replace(/^www\./, ""),
      });
    }
  }

  public getPromoCookie(): PromoCookieData | undefined {
    return this.getCookieAsJson<PromoCookieData>("promoParam");
  }

  public initSourceCookie() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = this.extractUTMParams(urlParams, ["source"]);
    const domain = window.location.hostname;

    if (Object.keys(utmParams).length) {
      const parms = {
        source: utmParams.source,
      };
      this.putCookie("source", JSON.stringify(parms), {
        expires: 90,
        expiresUnit: "day",
        customDomain: domain.replace(/^www\./, ""),
      });
    }
  }

  public getSourceCookie(): GCLIDCookieData | undefined {
    return this.getCookieAsJson<GCLIDCookieData>("source");
  }

  public initURLParamsCookies() {
    this.initUTMCookie();
    this.initGCLIDCookie();
    this.initPromoCookie();
  }

  public deleteCookie(
    name: string,
    options?: { path?: string; customDomain?: string }
  ) {
    const { path = "/", customDomain } = options || {};
    const secure = window.location.protocol === "https:";

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax${secure ? "; Secure" : ""}${
      customDomain ? "; domain=" + customDomain : ""
    }`;

    delete this.cookieMap[name];
  }

  public addUTMParams(formValues: Record<string, any>): Record<string, any> {
    const urlParams = new URLSearchParams(window.location.search);
    const cookieParams = {
      ...this.getUTMCookie(),
      ...this.getGCLIDCookie(),
      ...this.getSourceCookie(),
    };
    const utmLeadParams: Record<string, string> = {
      utm_campaign: "lead_url_campaign__c",
      utm_content: "lead_url_content__c",
      utm_medium: "lead_url_medium__c",
      utm_source: "lead_url_source__c",
      utm_term: "lead_url_term__c",
      gclid: "gclid__c",
      source: "other_source__c",
    };

    const updatedValues = { ...formValues };

    for (const key of Object.keys(utmLeadParams)) {
      const fieldName = utmLeadParams[key];

      const value =
        urlParams.get(key) ?? cookieParams[key as keyof typeof cookieParams];

      if (value) {
        updatedValues[fieldName] = value;
      }
    }

    return updatedValues;
  }
}

const inst = new CookieUtility();
export default inst;
