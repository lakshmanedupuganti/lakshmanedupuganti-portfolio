import "server-only";

import util from "@serverlib/utility";
import {
  ContentEntry,
  ServerContentItemComponentProps,
  expandReferenceLinks,
} from "@lakshmanedupuganti/server-library";
import { AppPageProps, PageEntry } from "@src/lib/types";
import ClientHandlerRoot from "@server/utility/ClientHandlerRoot";

const DefaultPage = async (props: AppPageProps) => {
  const { params, searchParams } = props;
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug =
    resolvedSearchParams.slug || resolvedParams.slug?.join("/") || "";
  const [pageResult, helpers] = await util.getNextPageResult(
    slug,
    resolvedSearchParams,
    false,
  );

  // TODO - handle pageResult.unsentCookies which will show when we have a RSC call /page JSON fetch/
  // pageResult.unsentCookies

  // we have a redirect or no items, so we don't need to render anything
  if (pageResult.redirectLocation || !pageResult.items.length) return null;
  const { items, includes } = pageResult;

  const expandedItems = expandReferenceLinks(items, includes);
  const page = expandedItems[0] as PageEntry;

  const { contents, disableNavigation, header, footer } = page.fields;
  // no longer using shared entries showing on all pages will come from the footer entry)
  const allContents = (contents as ContentEntry[]) || [];
  const pageHeader = disableNavigation
    ? null
    : allContents.find((item: ContentEntry) => item.contentType === "header") ||
      header;
  const pageFooter = disableNavigation
    ? null
    : allContents.find((item) => item.contentType === "footer") || footer;

  const componentRenderFunc = util.genRenderServerContentItemComponent();
  const commonComponentProps: ServerContentItemComponentProps = {
    item: page as ContentEntry,
    renderContentItemComponent: componentRenderFunc,
    pageResult: {
      ...pageResult,
      items: expandedItems,
    },
    helpers,
  };

  // Filter out header and footer items from allContents
  const filteredContents = allContents.filter(
    (item) => item.contentType !== "header" && item.contentType !== "footer",
  );

  // pass footerNavigationRoot to pageHeader fields if it exists
  if (pageFooter?.fields.footerNavigationRoot && pageHeader) {
    // Create a new object with the footerNavigationRoot property
    pageHeader.fields = {
      ...pageHeader.fields,
      footerNavigation: pageFooter,
    };
  }
  return (
    <>
      <title>{page.fields.htmlTitle || page.fields.title || ""}</title>
      <meta name="description" content={page.fields.description || ""} />
      <meta name="keywords" content={page.fields.keywords || ""} />
      {!!page.fields.seoMetadata &&
        componentRenderFunc(page.fields.seoMetadata, commonComponentProps)}
      {!!pageHeader && componentRenderFunc(pageHeader, commonComponentProps)}
      <main>
        {filteredContents.map((item) =>
          componentRenderFunc(item, commonComponentProps, item.id),
        )}
      </main>
      <div role="contentinfo">
        {!!pageFooter && componentRenderFunc(pageFooter, commonComponentProps)}
      </div>
      <ClientHandlerRoot {...commonComponentProps} />
    </>
  );
};

export default DefaultPage;
