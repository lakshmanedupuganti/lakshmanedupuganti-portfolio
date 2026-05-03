import type { ServerTemplateTypeComponentMap } from "@lakshmanedupuganti/server-library";
import Default from "@server/contenttemplates/Default";

const templateMap: ServerTemplateTypeComponentMap = {
  content: {
    _default: Default,
  },
};

export default templateMap;
