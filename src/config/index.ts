import { configService } from "@lakshmanedupuganti/server-library";
import { SiteConfigEx } from "@src/lib/types";
import { getAdditionalEntries } from "@src/serverlib/utility/pageSvcFuncs";

// if using s3, assume all content query (single allconents.json for all content entries)
const useAllContentQuery =
  process.env.CONTENTFUL_USE_ALL_CONTENT_QUERY === "true" ||
  process.env.GENERAL_USE_S3_CONTENT === "true";

export const siteConfigs: SiteConfigEx[] = require(
  `./sites.${process.env.APP_ENV || "development"}.json`,
);

export const getNextPageServiceOptions = () => {
  const ret = configService.getNextPageServiceOptions(
    siteConfigs,
    useAllContentQuery,
    (config) => {
      // modify the config here if needed
      config.pageConfig = {
        ...config.pageConfig,
        getAdditionalEntries: async (
          pageResult,
          pageData,
          helper,
          pageServiceOptions,
        ) => {
          return await getAdditionalEntries(
            pageResult,
            pageData,
            helper,
            pageServiceOptions,
          );
        },
      };
      return config;
    },
  );
  return ret;
};

export const getNextPageServiceOptionsForSiteMap = () => {
  const ret = configService.getNextPageServiceOptions(
    siteConfigs,
    true, // useAllContentQuery (can be modified to use optimized query if not using s3, but keep it like this for now)
    (config) => {
      return config;
    },
  );
  return ret;
};

export const getSiteLocaleConfig = () => {
  const ret = configService.getSiteLocaleConfig(siteConfigs);
  return ret;
};
