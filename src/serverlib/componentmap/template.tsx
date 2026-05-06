import type { ServerTemplateTypeComponentMap } from "@lakshmanedupuganti/server-library";
import Default from "@server/contenttemplates/Default";
import Header from "@src/components/server/layout/Header";
import FooterNavigation from "@server/layout/FooterNavigation";
import SEOComponent from "@src/components/server/layout/SEOComponent";

const templateMap: ServerTemplateTypeComponentMap = {
  content: {
    _default: Default,
  },
  footer: {
    _default: FooterNavigation,
  },
  header: {
    _default: Header,
  },
  seo: {
    _default: SEOComponent,
  },
};

export default templateMap;
