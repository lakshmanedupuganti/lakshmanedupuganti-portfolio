import "server-only";

import type {
  ServerContentItemComponentProps,
  ContentEntry,
} from "@lakshmanedupuganti/server-library";
import ClientComponentLoader, {
  ClientTemplateLoaderProps,
} from "@src/components/client/utility/ClientComponentLoader";
import { NamedEnvMap } from "@src/lib/types";

export type ClientComponentBridgeProps = ServerContentItemComponentProps & {
  clientComponentType: string;
  itemExpandLogic: "emptyitem" | "itemonly" | "itemanddescendants";
  // emptyitem - item with empty fields is being sent to the client
  // itemonly - item with asset fields expanded, entry reference fields are not expanded
  // itemanddescendants - item with asset and entry reference fields expanded
  env?: NamedEnvMap;
  customFields?: Record<string, any>;
};

export const environmentConfig: NamedEnvMap = {
  GENERAL_RECAPTCHA_DELAYED: process.env.GENERAL_RECAPTCHA_DELAYED || "2000",
  RECAPTCHA_DELAYED_EXCLUDE_SLUG_REGEX:
    process.env.RECAPTCHA_DELAYED_EXCLUDE_SLUG_REGEX || "",
  EMEA_RECAPTCHA_V2_PUBLIC_KEY: process.env.EMEA_RECAPTCHA_V2_PUBLIC_KEY || "",
  EMEA_RECAPTCHA_V3_PUBLIC_KEY: process.env.EMEA_RECAPTCHA_V3_PUBLIC_KEY || "",
  RECAPTCHA_ENTERPRISE_KEY: process.env.RECAPTCHA_ENTERPRISE_KEY || "",
  RECAPTCHA_ACTIVE: process.env.RECAPTCHA_ACTIVE || "false",
  GENERAL_ENABLE_TRUSTARC: process.env.GENERAL_ENABLE_TRUSTARC || "false",
  TRUSTARC_BEHAVIOR: process.env.TRUSTARC_BEHAVIOR || "implied",
  TRUSTARC_PERAMETERS: process.env.TRUSTARC_PERAMETERS || "",
  RELOAD_ON_TRUSTARC_ACTION: process.env.RELOAD_ON_TRUSTARC_ACTION || "false",
  CLIENT_API_PREFIX: process.env.CLIENT_API_PREFIX || "",
  USE_DEVELOPMENT_PANEL: process.env.APP_ENV !== "production",
};

const ClientComponentBridge: React.FC<ClientComponentBridgeProps> = (
  props: ClientComponentBridgeProps,
) => {
  const {
    item,
    helpers,
    clientComponentType,
    itemExpandLogic = "emptyitem",
    env,
    pageResult,
    customFields,
  } = props;

  const clientResult =
    itemExpandLogic === "emptyitem"
      ? { items: [{ ...item, fields: {} }], includes: { Asset: [], Entry: [] } }
      : helpers.getResultForEntry(
          item.id,
          itemExpandLogic === "itemanddescendants",
        );
  if (clientResult.items.length === 0) return null;

  const clientItem = customFields
    ? {
        ...clientResult.items[0],
        fields: { ...clientResult.items[0].fields, ...customFields },
      }
    : clientResult.items[0];

  const clientProps: ClientTemplateLoaderProps = {
    item: clientItem as ContentEntry,
    includes: clientResult.includes,
    clientComponentType,
    env: {
      ...environmentConfig,
      ...env,
    },
    pageResult,
  };

  return <ClientComponentLoader {...clientProps} />;
};

export default ClientComponentBridge;
