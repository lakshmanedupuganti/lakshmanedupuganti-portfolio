"use client";

import crypto from "crypto";
import {
  _cx,
  cssvbtnColor,
  cssvbtnFontSize,
  cssvbtnHeight,
  cssvbtnHoverColor,
  cssvbtnPadding,
  csx,
} from "@src/lib/utility/stylings/classes";
import { ButtonFields } from "@src/lib/types";
import type { NextPageResult } from "@lakshmanedupuganti/server-library";

class Utility {
  public generateRandom(pattern: string): string {
    return pattern.replace(/[xy]/g, (c) => {
      const r = crypto.randomBytes(1)[0] % 16; // Generate a secure random number between 0 and 15
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  public generateClientShortGuid(): string {
    return this.generateRandom("xxxxxxxxxxxx");
  }

  public httpGet<T = any>(url: string): Promise<T> {
    return new Promise<T>(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send();
    });
  }

  public isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public removeClassFromElements(
    elements: NodeListOf<Element>,
    className: string,
  ) {
    Array.from(elements).forEach((element) => {
      element.classList.remove(className);
    });
  }

  public addClassToElements(elements: NodeListOf<Element>, className: string) {
    Array.from(elements).forEach((element) => {
      element.classList.add(className);
    });
  }

  public removeClassByPattern(element: HTMLElement, pattern: RegExp) {
    const cls = Array.from(element.classList).find((c) => pattern.test(c));
    if (cls) element.classList.remove(cls);
  }

  public resizeHandler(slideInitId: string, className: string) {
    const nodeSlideInit = document.querySelectorAll(`#${slideInitId}`);
    const isMobile = window.innerWidth < 800;

    // remove the .swiper-slide class from the slideinit element if the window is resized to mobile
    if (nodeSlideInit && !isMobile) {
      this.removeClassFromElements(nodeSlideInit, className);
    } else {
      this.addClassToElements(nodeSlideInit, className);
    }
  }

  public kebabCase(text: string) {
    if (!text) return "";
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  public getRelAttribute(target?: string, noFollow?: boolean) {
    let rel = "";
    if (target === "_blank") {
      rel = "noopener noreferrer";
    }
    if (noFollow) {
      rel = rel ? `${rel} nofollow` : "nofollow";
    }
    return rel;
  }

  public getButtonProps(
    fields: ButtonFields,
    css: { readonly [key: string]: string } = {},
  ) {
    const {
      variant = "primary",
      color,
      label = "button",
      target,
      noFollow,
      disabled,
      size = "md",
      dataTrackingKey,
    } = fields;

    const buttonProps = {
      "data-tracking-key": this.kebabCase(dataTrackingKey || label || ""),
      disabled,
      className: csx(css, "styledButton", "buttonText", "globalButton", {
        [variant]: true,
        link2: variant === "link",
      }),
      style: {
        "--btn-height": cssvbtnHeight(size),
        "--btn-padding": cssvbtnPadding(size),
        "--btn-font-size": cssvbtnFontSize(size),
        "--btn-color": cssvbtnColor(color),
        "--btn-hover-color": cssvbtnHoverColor(color),
      } as React.CSSProperties,
      variant,
      "aria-label": label,
      ...{
        ...(this.getRelAttribute(target, noFollow)
          ? { rel: this.getRelAttribute(target, noFollow) }
          : {}),
      },
    };

    return buttonProps;
  }
  //TODO: Need to check if we need this or not
  public addLocalePrefix(pageResult: NextPageResult, url: string): string {
    if (!pageResult) return url;

    const { site, localeId } = pageResult;
    let { locales = [] } = site;
    const locale = locales.find((l) => l.id === localeId);

    if (!locale) return url;

    const prefix = locale.slugPrefix || "";

    if (!prefix) {
      return url;
    }

    if (url.startsWith(`/${prefix}`)) {
      return url;
    }

    return `/${prefix}${url}`;
  }
}

const inst = new Utility();
export default inst;
