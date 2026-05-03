import type {
  AssetEntry,
  ContentfulPageAdditionalEntriesHelper,
  ContentfulPageResult,
  ContentfulPageResultBase,
  ContentfulPageServiceOptions,
  EntryEx,
  ETLEntryQueryResult,
  InternalEntry,
} from "@lakshmanedupuganti/server-library";
import { getAdditionalEntriesHeaderFooter } from "@lakshmanedupuganti/server-library/dist/src/util/pageSvcFuncs";
import { ContentfulPageGetAdditionalEntriesFuncEX } from "@src/lib/types";

export const getAdditionalEntries: ContentfulPageGetAdditionalEntriesFuncEX =
  async (
    pageResult: Readonly<ContentfulPageResult>,
    pageData: ETLEntryQueryResult,
    helper: ContentfulPageAdditionalEntriesHelper,
    pageServiceOptions: ContentfulPageServiceOptions,
  ): Promise<ContentfulPageResultBase> => {
    // Get header and footer entries
    const headerFooterResult = await getAdditionalEntriesHeaderFooter(
      pageResult,
      pageData,
      helper,
      pageServiceOptions,
    );

    const pageEntry = pageResult.items[0] as EntryEx | undefined;
    const additionalItems: InternalEntry[] = [];
    const additionalAssets: AssetEntry[] = [];
    const additionalEntries: EntryEx[] = [];

    if (pageEntry && pageEntry?.contentType === "page") {
    }
    // Combine the results
    return {
      items: [...headerFooterResult.items, ...additionalItems],
      includes: {
        Asset: [...headerFooterResult.includes.Asset, ...additionalAssets],
        Entry: [...headerFooterResult.includes.Entry, ...additionalEntries],
      },
    };
  };
