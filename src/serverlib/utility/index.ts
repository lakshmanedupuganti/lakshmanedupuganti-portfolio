import "server-only";

import type {
  ContentfulDataAttributes,
  DataAttributes,
  NavigationFields,
} from "@lib/types";
import { ParsedUrlQuery } from "querystring";
import { getNextPageServiceOptions } from "@src/config";
import {
  NextPageResult,
  NextPageResultHelpers,
  NextPageService,
  genRenderContentItemComponent,
} from "@lakshmanedupuganti/server-library";
import { Children, ReactNode, cloneElement, isValidElement } from "react";
import templateMap from "@src/serverlib/componentmap/template";
import crypto from "crypto";

export const previewDataCacheTime = parseInt(
  process.env.PREVIEW_DATA_CACHE_TIME || "3600",
);

// only stateless functions here
class Utility {
  private pageResult: NextPageResult | null = null;
  public async getNextPageResult(
    slug: string,
    query: ParsedUrlQuery,
    skipRedirect = false,
  ): Promise<[NextPageResult, NextPageResultHelpers]> {
    const svc = this.getNextPageService();
    const [result, helpers] = await svc.getResultForSlugAndQuery(
      slug,
      query,
      skipRedirect,
    );
    this.pageResult = result;
    return [result, helpers];
  }

  public getNextPageService() {
    const options = getNextPageServiceOptions();
    const svc = new NextPageService(options);
    return svc;
  }

  public genRenderServerContentItemComponent() {
    const ret = genRenderContentItemComponent(templateMap);
    return ret;
  }

  public isServerMobile(userAgent: string | undefined): boolean {
    if (!userAgent) return false;
    return (
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|WPDesktop/i,
      ) !== null
    );
  }

  public formatUrlWithParams(
    url = "",
    params:
      | string
      | string[][]
      | Record<string, string | undefined | null>
      | URLSearchParams
      | undefined,
  ): string {
    if (typeof params === "object" && !Array.isArray(params))
      params = Object.entries(params).reduce(
        (obj, [k, v]) => (v ? { ...obj, [k]: v } : obj),
        {},
      );

    return (
      url +
      (url.indexOf("?") >= 0 ? "&" : "?") +
      new URLSearchParams(
        params as
          | string
          | string[][]
          | URLSearchParams
          | Record<string, string>
          | undefined,
      ).toString()
    );
  }

  //TODO: Need to check if we need this or not
  public addLocalePrefix(url: string): string {
    if (!this.pageResult) return url;

    const { site, localeId } = this.pageResult;
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

  public isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public isArray(a: any) {
    return !!a && a.constructor === Array;
  }

  public isObject(a: any) {
    return !!a && a.constructor === Object;
  }

  public isString(a: any) {
    return !!a && typeof a === "string";
  }

  public isBoolean(a: any) {
    return !!a && typeof a === "boolean";
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

  public generateRandomString(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    const randomBytes = crypto.randomBytes(length); // Generate secure random bytes

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % charactersLength; // Map byte to a character index
      result += characters.charAt(randomIndex); // Add the corresponding character to the result
    }
    return `proweb_${result}`;
  }

  public toCamelCase(text: string): string {
    if (!text) return "";
    return text.replace(/[-\s](.)/g, function (match, group1) {
      return group1.toUpperCase();
    });
  }

  public addAttributesToChildren(
    children: ReactNode,
    dataAttributes: DataAttributes,
  ): ReactNode {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        const { children, ...props } = child.props as Record<string, any> & {
          children?: ReactNode;
          image?: any;
        };
        const childrenWithProps = props.image
          ? { ...props, dataAttributes }
          : { ...dataAttributes };

        return cloneElement(
          child,
          childrenWithProps,
          this.addAttributesToChildren(children, dataAttributes),
        );
      }
      return child;
    });
  }

  public applyDataAttributesToHTML(
    html: string,
    dataAttributes: DataAttributes,
  ): string {
    if (!html) return "";

    return html.replace(
      /<(\w+)([^>]*?)(\/?)>/g,
      (match, tag, rest, selfClosing) => {
        let newTag = `<${tag}${rest || ""}`;

        for (const [key, value] of Object.entries(dataAttributes)) {
          const attrPattern = new RegExp(`\\s${key}\\s*=\\s*(['"]).*?\\1`, "i");
          if (!attrPattern.test(rest)) {
            newTag += ` ${key}="${value}"`;
          }
        }

        return `${newTag}${selfClosing ? " /" : ""}>`;
      },
    );
  }

  public addIdToSlug(slug: string, id?: string): string {
    if (!id) return slug;
    return `${slug}#${id}`;
  }

  public renderContentfulDataAttributes(
    entryId: string,
    fieldName: string,
  ): ContentfulDataAttributes {
    return {
      "data-contentful-field-id": fieldName,
      "data-contentful-entry-id": entryId,
      "data-contentful-asset-id": entryId,
    };
  }

  public hasMatchingChildElement(children: ReactNode, type: string): boolean {
    let hasMatching = false;

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === type) {
        hasMatching = true;
      }
    });

    return hasMatching;
  }

  public hasChildNodes({ childNodes }: NavigationFields): boolean {
    return !!childNodes?.length;
  }

  public getDateDiffInYears(date: Date) {
    const today = new Date();
    const m = today.getMonth() - date.getMonth();
    const age = today.getFullYear() - date.getFullYear();
    const st = m < 0 || (m === 0 && today.getDate() < date.getDate());
    return st ? age - 1 : age;
  }

  public replaceWithSuperScript(content: string | undefined) {
    const el = ["&trade;", "™", "&reg;", "®", "&copy;", "©"];
    el.forEach((e) => {
      if (content?.split(e)[0].endsWith("<sup>")) return content;
      content = content?.replace(e, `<sup>${e}</sup>`);
    });
    content = content?.replace(/\[([^\[\]]+?)\]/g, `<sup>$1</sup>`);
    return content;
  }
}

const inst = new Utility();
export default inst;
