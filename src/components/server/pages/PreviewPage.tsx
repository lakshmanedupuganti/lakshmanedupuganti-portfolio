import "server-only";

import { Roboto } from "next/font/google";
import { AppPageProps, LocaleConfigEx } from "@src/lib/types";
import util from "@serverlib/utility";
import ClientHandlerRoot from "@server/utility/ClientHandlerRoot";
import {
  ContentEntry,
  ServerContentItemComponentProps,
  expandReferenceLinks,
} from "@lakshmanedupuganti/server-library";
import ContentfulPreview from "@src/components/client/utility/ContentfulPreview";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: [
    "cyrillic-ext",
    "cyrillic",
    "greek-ext",
    "greek",
    "vietnamese",
    "latin-ext",
    "latin",
  ],
  display: "swap",
  variable: "--font-roboto",
});

const PreviewPage = async (props: AppPageProps) => {
  const { params, searchParams } = props;
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const [pageResult, helpers] = await util.getNextPageResult(
    "",
    { ...resolvedSearchParams, ...resolvedParams },
    true,
  );
  const { locale = "en-US" } = resolvedParams;

  // we have a redirect or no items, so we don't need to render anything
  if (pageResult.redirectLocation || !pageResult.items.length) return null;

  const { site, localeId, items, includes } = pageResult;

  const lang =
    (
      site.locales.find((l: LocaleConfigEx) => l.id === localeId) as
        | LocaleConfigEx
        | undefined
    )?.defaultHtmlLang ||
    localeId ||
    "en";

  const expandedItems = expandReferenceLinks(items, includes);
  const page = expandedItems[0];

  const allContents = (
    page.contentType === "page" ? page.fields.contents || [] : [page]
  ) as ContentEntry[];

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

  return (
    <html lang={lang}>
      <head>
        <title>{`Preview entry id: ${page.id}`}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { scroll-behavior: auto; }`,
          }}
        ></style>
      </head>
      <body className={roboto.className}>
        <main>
          {allContents.map((item) =>
            componentRenderFunc(item, commonComponentProps, item.id),
          )}
        </main>
        <ContentfulPreview
          locale={locale as string}
          cacheKey={pageResult.previewCacheKey}
          entryid={page.id}
        />
        <ClientHandlerRoot {...commonComponentProps} />
      </body>
    </html>
  );
};

export default PreviewPage;
