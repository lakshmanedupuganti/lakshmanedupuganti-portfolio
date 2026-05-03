import "server-only";

import React from "react";
import { LocaleConfigEx, SiteConfigEx } from "@src/lib/types";

const isTrackingDisabled: boolean =
  process.env.GENERAL_DISABLE_TRACKING === "true";
const isTrustArcScriptEnabled: boolean =
  process.env.GENERAL_ENABLE_TRUSTARC === "true";
const isTrustArcLinkTagsEnabled: boolean =
  process.env.ENABLE_TRUSTARC_LINK_TAGS === "true";
const TRUSTARC_BEHAVIOR = process.env.TRUSTARC_BEHAVIOR || "implied";
const TRUSTARC_PERAMETERS =
  process.env.TRUSTARC_PERAMETERS ||
  "&c=teconsent&js=nj&noticeType=bb&text=true";
const isTrustArcAutoBlockEnabled: boolean =
  process.env.ENABLE_TRUSTARC_AUTOBLOCK === "true";

const enableNoIndex: boolean = process.env.GENERAL_ENABLE_NOINDEX === "true";

class Tracking {
  public renderGTMScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (isTrackingDisabled) {
      return null;
    }

    let { gtmKey = "", gtmDomain = "www.googletagmanager.com" } =
      siteConfig as SiteConfigEx;

    const locale = localeConfig;

    gtmKey = !!locale?.gtmKey ? locale.gtmKey : gtmKey;

    if (!gtmKey) {
      return null;
    }

    let js = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://${gtmDomain}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmKey}');`;

    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: js }}></script>
      </>
    );
  }

  public renderGTMNoScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (isTrackingDisabled) {
      return null;
    }

    let { gtmKey = "", gtmDomain = "www.googletagmanager.com" } =
      siteConfig as SiteConfigEx;

    const locale = localeConfig;

    gtmKey = !!locale?.gtmKey ? locale.gtmKey : gtmKey;

    if (!gtmKey) {
      return null;
    }

    let tag = `<iframe src="https://${gtmDomain}/ns.html?id=${gtmKey}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

    return <noscript dangerouslySetInnerHTML={{ __html: tag }}></noscript>;
  }

  public renderMarketScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (isTrackingDisabled) {
      return null;
    }
    const { id } = localeConfig;
    const [language, region] = id.split("-");
    let marketName = region
      ? `${region.toLowerCase()}-${language.toLowerCase()}`
      : language.toLowerCase();

    if (!marketName) {
      return null;
    }
    let scriptContent = `
      var dataLayer = window.dataLayer || [];
      dataLayer.push({ 'market': '${marketName}' });
    `;

    return (
      <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
    );
  }

  public renderEvergageScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (isTrackingDisabled) {
      return null;
    }

    const { evergageEnabled } = siteConfig as SiteConfigEx;
    if (!evergageEnabled) return null;

    return (
      <script
        async
        type="text/javascript"
        src="//cdn.evgnet.com/beacon/aligntechnology/invisalign/scripts/evergage.min.js"
      ></script>
    );
  }

  public renderTrustArcLinkTags(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (
      isTrackingDisabled ||
      isTrustArcScriptEnabled ||
      !isTrustArcLinkTagsEnabled
    ) {
      return null;
    }

    return (
      <>
        <link rel="dns-prefetch" href="https://consent.trustarc.com/" />
        <link
          rel="preconnect"
          href="https://consent.trustarc.com/"
          crossOrigin="anonymous"
        />
      </>
    );
  }

  public renderTrustArcScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (
      isTrackingDisabled ||
      !isTrustArcScriptEnabled ||
      isTrustArcLinkTagsEnabled
    ) {
      return null;
    }

    const {
      locales = [],
      localRegion,
      defaultTrustArcCountry,
      domain,
    } = siteConfig as SiteConfigEx;

    const currentLocale = locales.find(
      (locale) => locale.id === localeConfig.id
    ) as LocaleConfigEx;

    if (!currentLocale) {
      console.warn(`Locale configuration not found for ID: ${localeConfig.id}`);
    }

    const {
      defaultTrustArcLang,
      defaultTrustArcCountry: localeSpecificTrustArcCountry,
      privacyPolicySlug,
    } = currentLocale || {};

    const siteDomain = domain || "invisalign.com";
    const privacyPolicyUrl = `https://${siteDomain}/${privacyPolicySlug}`;

    // Region to country code mapping for TrustArc
    const REGION_TO_COUNTRY_MAPPING: Record<string, string> = {
      US: "us",
      EMEA: "gb",
      APAC: "au",
    } as const;

    // Parse locale parts for fallback values
    const [localeLanguage, localeCountry] = localeConfig.id?.split("-") || [];

    const trustArcLang = defaultTrustArcLang || localeLanguage || "en";

    const trustArcCountry =
      localeSpecificTrustArcCountry ||
      defaultTrustArcCountry ||
      REGION_TO_COUNTRY_MAPPING[localRegion?.toUpperCase() || ""] ||
      localeCountry ||
      "N/A";

    let trustArcScript = `https://consent.trustarc.com/notice?domain=invisalign.com&country=${trustArcCountry}&language=${trustArcLang}&gtm=1${
      privacyPolicySlug ? `&privacypolicylink=${privacyPolicyUrl}` : ""
    }`;

    if (trustArcCountry === "N/A") {
      trustArcScript = trustArcScript.replace(
        `&country=${trustArcCountry}`,
        ""
      );
    }

    // Compute trustArcScript based on TRUSTARC_BEHAVIOR
    if (TRUSTARC_BEHAVIOR !== "expressed") {
      trustArcScript +=
        TRUSTARC_PERAMETERS || "&c=teconsent&js=nj&noticeType=bb&text=true";
    } else {
      trustArcScript += `&behavior=${TRUSTARC_BEHAVIOR}`;
    }

    // console.log(trustArcScript);

    return (
      <>
        <script src={trustArcScript} type="text/javascript" async></script>
      </>
    );
  }

  public renderTrustArcAutoBlockScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    if (
      isTrackingDisabled ||
      !isTrustArcAutoBlockEnabled ||
      !isTrustArcScriptEnabled
    ) {
      return null;
    }

    const { locales = [], localRegion, defaultTrustArcCountry } = siteConfig;
    const locale = locales.find(
      (l) => l.id === localeConfig.id
    ) as LocaleConfigEx;
    const {
      defaultTrustArcCountry: localeSpecificTrustArcCountry,
      defaultTrustArcLang,
    } = locale as LocaleConfigEx;
    // Parse locale parts for fallback values
    const [localeLanguage, localeCountry] = localeConfig.id?.split("-") || [];

    // Region to country code mapping for TrustArc
    const REGION_TO_COUNTRY_MAPPING: Record<string, string> = {
      US: "us",
      EMEA: "gb",
      APAC: "au",
    } as const;

    const trustArcLang = defaultTrustArcLang || localeLanguage || "en";

    const trustArcCountry =
      localeSpecificTrustArcCountry ||
      defaultTrustArcCountry ||
      REGION_TO_COUNTRY_MAPPING[localRegion?.toUpperCase() || ""] ||
      localeCountry ||
      "N/A";

    let TRUSTARC_AUTOBLOCK_SRC = `https://consent.trustarc.com/autoblockasset/core.min.js?domain=invisalign.com&country=${trustArcCountry}&language=${trustArcLang}`;
    let TRUSTARC_AUTOBLOCK_OPTOUT_SRC = `https://consent.trustarc.com/autoblockoptout?domain=invisalign.com&country=${trustArcCountry}&language=${trustArcLang}`;

    return (
      <>
        <script src={TRUSTARC_AUTOBLOCK_SRC} type="text/javascript" async />
        <script
          src={TRUSTARC_AUTOBLOCK_OPTOUT_SRC}
          type="text/javascript"
          async
        />
      </>
    );
  }

  public renderNoIndexScripts() {
    if (!enableNoIndex) return null;
    return (
      <>
        <meta name="robots" content="noindex" />
        <meta name="robots" content="noimageindex" />
      </>
    );
  }

  public renderOptimizelyScript(
    siteConfig: SiteConfigEx,
    localeConfig: LocaleConfigEx
  ): React.ReactElement | null {
    let { optimizelyKey } = siteConfig as SiteConfigEx;

    const locale = localeConfig;

    optimizelyKey = !!locale?.optimizelyKey
      ? locale.optimizelyKey
      : optimizelyKey;

    if (!optimizelyKey || isTrackingDisabled) {
      return null;
    }

    return (
      <script
        src={`https://cdn.optimizely.com/js/${optimizelyKey}.js`}
      ></script>
    );
  }
}

const inst = new Tracking();
export default inst;
