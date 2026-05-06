import type { ContentEntry } from "@lakshmanedupuganti/server-library";
import type {
  NavigationEntry,
  SiteConfigEx,
  SiteNavigationElementPart,
} from "@src/lib/types";
import Util from "@serverlib/utility";

class Utility {
  public getCurrentLocale(site: SiteConfigEx, localeId: string) {
    return site.locales.find((l) => l.id === localeId);
  }

  public getPageSlugWithSitePrefix(
    slug: string,
    site: SiteConfigEx,
    localeId: string,
  ): string {
    const currentLocale = this.getCurrentLocale(site, localeId);
    return slug === "/"
      ? currentLocale?.slugPrefix
        ? `${currentLocale.slugPrefix}`
        : ""
      : slug;
  }

  public getWebPageUrl(
    slug: string,
    site: SiteConfigEx,
    localeId: string,
  ): string {
    const metaTagURL = this.getPageSlugWithSitePrefix(slug, site, localeId);

    const webPageUrl: string = `https://${site.domain}/${metaTagURL}`;

    return webPageUrl.replace(/<|>|x3C/g, "");
  }

  public getImageUrl(imageUrl: string) {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("//")) return imageUrl;

    return `https:${imageUrl}`;
  }

  public getFirstContentImage(contents: ContentEntry[]) {
    const firstContentImage =
      contents?.[0].fields?.image?.[0]?.fields?.file?.url;
    const secondContentImage =
      contents?.[1]?.fields?.image?.[0]?.fields?.file?.url;

    return firstContentImage || secondContentImage;
  }

  public getSiteNavigationElementParts(
    navNodes: NavigationEntry[],
    site: SiteConfigEx,
    localeId: string,
  ): SiteNavigationElementPart[] {
    const navElements: SiteNavigationElementPart[] = [];

    navNodes.forEach((node) => {
      const { fields } = node;
      const { childNodes, calculatedUrl, title, label, addIdToSlug } =
        fields as any;

      if ((title || label) && calculatedUrl) {
        const navUrl = Util.addIdToSlug(calculatedUrl, addIdToSlug);

        navElements.push({
          "@type": "SiteNavigationElement",
          name: title || label,
          url:
            navUrl.startsWith("https://") || navUrl.startsWith("http://")
              ? navUrl
              : this.getWebPageUrl(navUrl, site, localeId),
        });
      }

      if (!childNodes || !childNodes.length) return;

      const childNavElements = this.getSiteNavigationElementParts(
        childNodes,
        site,
        localeId,
      );

      navElements.push(...childNavElements);
    });

    return navElements;
  }
}

const util = new Utility();

export default util;
