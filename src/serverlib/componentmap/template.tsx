import type { ServerTemplateTypeComponentMap } from "@lakshmanedupuganti/server-library";
import Default from "@server/contenttemplates/Default";
import Header from "@src/components/server/layout/Header";
import FooterNavigation from "@server/layout/FooterNavigation";
import SEOComponent from "@src/components/server/layout/SEOComponent";
import HeroArea from "@server/contenttemplates/HeroArea";
import TextAndMedia from "@src/components/server/contenttemplates/TextAndMedia";
import HeadingCardsCta from "@server/contenttemplates/containertemplates/HeadingCardsCta";
import CardWithCounter from "@src/components/server/contenttemplates/CardWithCounter";
import Card from "@src/components/server/contenttemplates/Card";

const templateMap: ServerTemplateTypeComponentMap = {
  content: {
    _default: Default,
    "text and media": TextAndMedia,
    "card with counter": CardWithCounter,
    card: Card,
  },

  heroArea: {
    _default: HeroArea,
  },
  containerHeadingCardsCta: {
    _default: HeadingCardsCta,
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
