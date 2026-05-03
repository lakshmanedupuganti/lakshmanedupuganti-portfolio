import { getNextPageServiceOptionsForSiteMap } from "@src/config";
import { PageFields, SEOMetadataFields } from "@src/lib/types";
import {
  ContentEntry,
  ContentfulETLGetEntriesOptions,
  InternalEntry,
  SysLink,
  contentulEtlService,
  siteLocaleService,
} from "@lakshmanedupuganti/server-library";

export interface SiteMapItem {
  loc: string;
  lastmod: string;
  imageUrl?: string;
  priority: string;
}

class SiteMapUtil {
  public async GetSiteMap(domain: string): Promise<SiteMapItem[]> {
    let ret: SiteMapItem[] = [];

    const opts = getNextPageServiceOptionsForSiteMap();
    const [siteConfig] = siteLocaleService.getSiteLocaleConfigForDomain(
      opts.siteLocaleConfig,
      domain,
      "",
    );

    for (let i = 0; i < siteConfig.locales.length; i++) {
      const locale = siteConfig.locales[i];

      const etlOptions: ContentfulETLGetEntriesOptions = {
        ...opts,
        ...opts.pageConfig.coreQueryConfig, // assume core query will return all needed entries
        initRouteData: false,
        locale: locale.id,
        resolveSlugToUrl(slug) {
          return `/${locale.slugPrefix}${slug}`;
        },
      };

      const etlData = await contentulEtlService.getETLEntriesCached(etlOptions);

      const formatLoc = (slug: string) =>
        ["https://", siteConfig.domain, locale.slugPrefix, slug]
          .filter((v) => v)
          .map((v) => v?.replace(/\/$/gi, ""))
          .filter((v) => v)
          .join("/");

      const pages: InternalEntry<PageFields>[] =
        etlData.itemsPerContentType["page"] || [];
      const labels: InternalEntry[] =
        etlData.itemsPerContentType["label"] || [];

      const removePagesFromSiteMap: string[] = labels
        .find((l) => l.fields.key === "removePagesFromSiteMap")
        ?.fields.value?.split(",") || ["test-page"];

      const pageRet = pages
        .filter((p) => {
          const seoMetaData = this.getEntriesFromMultiRefField(
            p,
            etlData.itemMap,
            "seoMetadata",
          ) as ContentEntry<SEOMetadataFields>[];
          const pageSlug = p.fields.slug || "";

          const shouldExclude = seoMetaData.some(
            (seo) => seo.fields?.excludeInSitemap,
          );

          if (shouldExclude || !pageSlug) {
            return false;
          }

          return !removePagesFromSiteMap.some((keyword) =>
            pageSlug.includes(keyword),
          );
        })
        .map((p) => {
          const contentsData = this.getEntriesFromMultiRefField(
            p,
            etlData.itemMap,
            "contents",
          );
          const firstValidAssetUrl = this.getFirstValidContentAssetUrl(
            contentsData,
            etlData.itemMap,
          );
          const imageUrl = firstValidAssetUrl
            ? `https:${firstValidAssetUrl}`
            : "https://images.ctfassets.net/vh25xg5i1h5l/70RMXiZD7ytB3KvIAi7Ye8/07ad3d5196128beb9b0435bc1cbb39c6/vertical_logos.jpg";

          return {
            loc: formatLoc(p.fields.slug || ""),
            lastmod: p?.updatedAt?.split("T")?.[0] || "",
            imageUrl,
            priority: p.fields.slug === "/" ? "1.0" : "0.8",
          };
        });
      const sortedPageRet = pageRet.sort((a, b) =>
        a.loc.length < b.loc.length ? -1 : 1,
      );
      ret = [...ret, ...sortedPageRet];
    }

    return ret;
  }

  private getEntriesFromMultiRefField(
    entry: InternalEntry,
    itemMap: Record<string, InternalEntry>,
    fieldName = "image",
  ): InternalEntry[] {
    const field = entry.fields[fieldName];

    if (Array.isArray(field)) {
      const fieldEntries = field
        .map((entry) => this.getLinkedEntry(entry, itemMap))
        .filter((e) => !!e) as InternalEntry[];
      return fieldEntries;
    } else if (field && field.sys) {
      const assetEntry = this.getLinkedEntry(field, itemMap) as InternalEntry;
      return assetEntry ? [assetEntry] : [];
    }
    return [];
  }

  private getLinkedEntry(
    entry: SysLink,
    itemMap: Record<string, InternalEntry>,
  ) {
    const sys = entry.sys;
    if (sys && sys.type === "Link" && sys.id && itemMap[sys.id]) {
      return itemMap[sys.id];
    }
    return entry;
  }

  private getFirstValidContentAssetUrl(
    items: InternalEntry[],
    itemMap: Record<string, InternalEntry>,
    fieldName = "image",
  ) {
    for (const item of items) {
      const val =
        item.fields && (item.fields as { [key: string]: any })[fieldName];

      if (Array.isArray(val) && val.length) {
        const assetEntries = this.getEntriesFromMultiRefField(
          item,
          itemMap,
          fieldName,
        );
        const assetUrl =
          assetEntries[0].fields &&
          assetEntries[0].fields.file &&
          assetEntries[0].fields.file.url;

        if (assetUrl) {
          return assetUrl;
        }
      } else if (val && val.sys) {
        const sys = val.sys;
        if (sys && sys.type === "Link" && sys.id && itemMap[sys.id]) {
          const assetEntry = itemMap[sys.id];
          const assetUrl =
            assetEntry.fields &&
            assetEntry.fields.file &&
            assetEntry.fields.file.url;

          if (assetUrl) {
            return assetUrl;
          }
        }
      }
    }

    return null;
  }
}

const inst = new SiteMapUtil();
export default inst;
