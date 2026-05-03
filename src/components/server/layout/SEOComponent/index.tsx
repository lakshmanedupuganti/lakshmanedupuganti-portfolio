import "server-only";

import { SEOMetadataFields } from "@src/lib/types";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";
import structuredData from "@server/layout/SEOComponent/structuredData";
import util from "@server/layout/SEOComponent/util";

type SEOComponentProps = ServerContentItemComponentProps<SEOMetadataFields>;

const SEOComponent = (props: SEOComponentProps) => {
  const { pageResult } = props;
  if (!pageResult) return null;

  const { site, slug, localeId } = pageResult;
  const page = pageResult.items[0];
  if (!page) return null;

  const {
    htmlTitle = "",
    description = "",
    title = "",
    contents,
    slug: pageSlug,
    seoMetadata,
  } = page.fields;

  const enableNoIndex = process.env.GENERAL_ENABLE_NOINDEX === "true";
  const enableSchema = process.env.GENERAL_ENABLE_SCHEMA === "true";

  let {
    openGraphImage,
    openGraphDescription,
    openGraphTitle,
    twitterCardType = "summary",
    twitterDescription,
    twitterImage,
    twitterTitle,
    robotsMetaTag,
    canonicalTagUrl,
  } = (seoMetadata?.fields as SEOMetadataFields) || {};

  if (pageSlug === "not-found" || !contents) {
    return null;
  }
  const previewImage = util.getFirstContentImage(contents);
  const openGraphImageUrl = util.getImageUrl(
    openGraphImage?.fields?.file?.url || previewImage,
  );
  const twitterImageUrl = util.getImageUrl(
    twitterImage?.fields?.file?.url || previewImage,
  );

  const robotsMetaTagContent = !enableNoIndex
    ? robotsMetaTag?.join(",") || ""
    : "";

  const webPageUrl: string = util.getWebPageUrl(slug, site, localeId);

  return (
    <>
      <meta
        name="title"
        property="og:title"
        content={openGraphTitle || htmlTitle || title}
      />
      <meta
        name="description"
        property="og:description"
        content={openGraphDescription || description || ""}
      />
      <meta name="type" property="og:type" content="website" />
      <meta property="og:image" content={openGraphImageUrl} />
      <meta property="og:url" content={webPageUrl} />
      <meta property="og:description" content={description || "invisalign"} />
      <meta name="twitter:title" content={twitterTitle || htmlTitle || title} />
      <meta
        name="twitter:description"
        content={twitterDescription || description || "invisalign"}
      />
      <meta property="og:locale" content={localeId || "en-US"} />
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:site" content="@invisalign" />
      <meta name="twitter:url" content={webPageUrl} />
      <meta name="twitter:image" content={twitterImageUrl} />
      <meta name="twitter:creator" content="@invisalign" />
      {robotsMetaTagContent && (
        <meta name="robots" content={`${robotsMetaTagContent}`} />
      )}
      <link rel="canonical" href={canonicalTagUrl ?? webPageUrl} />
      {enableSchema && structuredData.renderSchemaMarkup(props)}
    </>
  );
};

export default SEOComponent;
