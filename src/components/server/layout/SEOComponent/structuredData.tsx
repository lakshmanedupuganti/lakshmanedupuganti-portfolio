import {
  AssetEntry,
  ServerContentItemComponentProps,
} from "@aligntech-cw/contentful-server-lib2";
import {
  AnchorLinksAccordianSchema,
  FAQPageSchema,
  FAQSchema,
  HomeFAQPageSchema,
  ImageGallerySchema,
  ImageObject,
  ItemListElement,
  SEOMetadataFields,
  SiteNavigationElement,
  TextContent,
  WebPageSchema,
} from "@src/lib/types";
import util from "@server/layout/SEOComponent/util";
import { renderOnlyText } from "@server/contenttemplates/commontemplates/ContentText";

const socialMediaContacts: Record<string, string> = {
  facebookUrl: "https://www.facebook.com/invisalign",
  twitterUrl: "https://twitter.com/invisalign",
  instagramUrl: "https://www.instagram.com/invisalign",
  youtubeUrl: "https://www.youtube.com/invisalign",
  pinterestUrl: "https://www.pinterest.com/invisalign",
  tiktokUrl: "https://www.tiktok.com/@invisalignofficial",
};

class StructuredData {
  private renderHeaderFooterNavSchema(
    pageProps: ServerContentItemComponentProps<SEOMetadataFields>
  ) {
    const { pageResult } = pageProps;
    if (!pageResult) return null;

    const { site, slug, localeId } = pageResult;
    const page = pageResult.items[0];

    const { header, footer } = page.fields;
    const { topNavigationRoot } = header.fields;
    const { bottomNavigationRoot } = footer.fields;

    const navgationNodes = topNavigationRoot?.fields.childNodes || [];
    const bottomNavgationNodes = bottomNavigationRoot?.fields.childNodes || [];

    const topNavElements = util.getSiteNavigationElementParts(
      [...navgationNodes, ...header?.fields?.buttons],
      site,
      localeId
    );
    const bottomNavNodes = util.getSiteNavigationElementParts(
      [...bottomNavgationNodes, ...footer?.fields?.buttons],
      site,
      localeId
    );

    const webPageUrl: string = util.getWebPageUrl(slug, site, localeId);

    const headerNavSchem: SiteNavigationElement = {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: "Navigation Menu Header",
      url: webPageUrl,
      hasPart: topNavElements,
    };

    const footerNavSchema: SiteNavigationElement = {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: "Navigation Menu Footer",
      url: webPageUrl,
      mainEntity: bottomNavNodes,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(headerNavSchem) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(footerNavSchema) }}
        />
      </>
    );
  }

  private renderImageGallerySchema(assets: AssetEntry[], webPageUrl: string) {
    const imageGalleryAssets = assets.filter((asset) => {
      return asset.fields?.file?.contentType?.includes("image");
    });
    if (!imageGalleryAssets.length) return;
    const hasPart: ImageObject[] = imageGalleryAssets.map((asset) => {
      const assetUrl = util.getImageUrl(asset.fields?.file?.url);
      return {
        "@type": "ImageObject",
        description: asset.fields?.description || asset.fields?.title || "",
        url: assetUrl || "",
        height: asset.fields?.file?.details?.image?.height || 300,
        width: asset.fields?.file?.details?.image?.width || 300,
      };
    });

    const imageGallerySchema: ImageGallerySchema = {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "ImageGallery",
      url: webPageUrl.replace(/<|>|x3C/g, ""),
      hasPart,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />
    );
  }

  private rendarAnchorLinksAccordianSchema(
    pageProps: ServerContentItemComponentProps<SEOMetadataFields>
  ) {
    const { pageResult } = pageProps;
    if (!pageResult) return null;

    const { site, slug, localeId, includes } = pageResult;
    const { Entry } = includes;

    const containerAnchorLinks = Entry.filter((entry) => {
      return entry.contentType === "containerAnchorLinks";
    });

    if (!containerAnchorLinks.length) return;

    const containerAccordionEntries = Entry.filter((entry) => {
      return entry.contentType === "containerAccordion";
    });

    if (!containerAccordionEntries.length) return;

    const webPageUrl: string = util.getWebPageUrl(slug, site, localeId);

    const itemListElement: ItemListElement[] = containerAccordionEntries.map(
      (entry, idx) => {
        const { fields } = entry;
        const { textContent } = fields;
        const { headline, bodyContent } = (textContent as TextContent) || {};
        return {
          "@type": "ListItem",
          position: idx + 1,
          name: renderOnlyText(headline) || "",
          description: renderOnlyText(bodyContent) || "",
        };
      }
    );

    const anchorLinksAccordianSchema: AnchorLinksAccordianSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      url: webPageUrl,
      itemListElement: itemListElement || [],
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(anchorLinksAccordianSchema),
        }}
      />
    );
  }

  private renderFAQSchema(
    pageProps: ServerContentItemComponentProps<SEOMetadataFields>
  ) {
    const { pageResult } = pageProps;
    if (!pageResult) return null;

    const { site, slug, localeId, includes } = pageResult;
    const { Entry } = includes;
    const page = pageResult.items[0];
    if (!page) return null;

    const { htmlTitle = "", seoMetadata, header } = page.fields;

    const faqEntries = Entry.filter((entry) => {
      return entry.contentType === "faq";
    });

    if (!faqEntries.length) return;

    let { jsonLd } = (seoMetadata?.fields as SEOMetadataFields) || {};

    const { contactPoint } = jsonLd || {};

    const webPageUrl: string = util.getWebPageUrl(slug, site, localeId);

    const faqSchema: FAQSchema[] = faqEntries.map((entry) => {
      const { fields } = entry;
      const { question, answer } = fields;

      return {
        "@type": "Question",
        name: renderOnlyText(question),
        acceptedAnswer: {
          "@type": "Answer",
          text: renderOnlyText(answer),
        },
      };
    });

    const faqPageSchema: FAQPageSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      name: "FAQ",
      url: webPageUrl,
      mainEntity: faqSchema,
    };

    const logoUrl = util.getImageUrl(
      header?.fields?.desktopLogo?.fields?.file?.url ||
        header?.fields?.mobileLogo?.fields?.file?.url
    );

    if (contactPoint) {
      const homeFAQPageSchema: HomeFAQPageSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalOrganization",
            MedicalSpecialty: "Dentistry",
            name: "Invisalign Provider",
            url: webPageUrl,
            logo: logoUrl,
            contactPoint: contactPoint,
          },
          {
            "@type": "FAQPage",
            mainEntity: faqSchema,
          },
        ],
      };

      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeFAQPageSchema),
          }}
        />
      );
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
    );
  }

  public renderSchemaMarkup(
    pageProps: ServerContentItemComponentProps<SEOMetadataFields>
  ) {
    const { pageResult } = pageProps;
    if (!pageResult) return null;

    const { site, slug, localeId, includes } = pageResult;
    const { Asset } = includes;
    const page = pageResult.items[0];
    if (!page) return null;

    const {
      htmlTitle = "",
      description = "",
      seoMetadata,
      contents,
      header,
    } = page.fields;

    const { desktopLogo, mobileLogo } = header.fields;

    let { openGraphImage, jsonLd } =
      (seoMetadata?.fields as SEOMetadataFields) || {};
    const { customSchemaScript } = jsonLd || {};

    const previewImage = util.getFirstContentImage(contents);
    const openGraphImageUrl = util.getImageUrl(
      openGraphImage?.fields?.file?.url || previewImage
    );
    const logoUrl = util.getImageUrl(
      desktopLogo?.fields?.file?.url ||
        mobileLogo?.fields?.file?.url ||
        openGraphImageUrl
    );
    const webPageUrl: string = util.getWebPageUrl(slug, site, localeId);

    const webPageSchema: WebPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": webPageUrl.replace(/<|>|x3C/g, ""),
      },
      headline: htmlTitle,
      description: description,
      datePublished: page.updatedAt || "",
      author: {
        "@type": "Organization",
        name: "Invisalign",
      },
      publisher: {
        "@type": "Organization",
        name: "Invisalign US",
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      image: {
        "@type": "ImageObject",
        url: `https:${openGraphImageUrl}`,
      },
    };

    const sameAs = Object.values(socialMediaContacts);

    const contactPointSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      MedicalSpecialty: "Dentistry",
      name: "Invisalign Provider",
      logo: logoUrl,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://www.invisalign.com/contact-us",
      },
      sameAs,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        {this.renderImageGallerySchema(Asset, webPageUrl)}
        {this.renderHeaderFooterNavSchema(pageProps)}
        {this.renderFAQSchema(pageProps)}
        {this.rendarAnchorLinksAccordianSchema(pageProps)}
        {customSchemaScript && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: customSchemaScript.replace(/<|>|x3C/g, ""),
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(contactPointSchema),
          }}
        />
      </>
    );
  }
}

const instance = new StructuredData();

export default instance;
