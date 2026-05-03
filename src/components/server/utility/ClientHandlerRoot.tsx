import "server-only";
import GlobalClickHandler from "@src/components/client/utility/GlobalClickHandler";
import GlobalUseEffectHandler from "@src/components/client/utility/GlobalUseEffectHandler";
import LocalInputHandler from "@src/components/client/utility/LocalInputHandler";
import ClientComponentBridge, {
  environmentConfig,
} from "./ClientComponentBridge";
import type {
  ContentEntry,
  ServerContentItemComponentProps,
} from "@aligntech-cw/contentful-server-lib2";

export const emptyItem: ContentEntry = { id: "", contentType: "", fields: {} };

const ClientHandlerRoot: React.FC<ServerContentItemComponentProps> = (
  props
) => {
  return (
    <>
      <GlobalClickHandler />
      <LocalInputHandler />
      <GlobalUseEffectHandler pageResult={props.pageResult} item={emptyItem} />
      <ClientComponentBridge
        {...props}
        item={emptyItem}
        clientComponentType="ScrollToTop"
        itemExpandLogic="emptyitem"
      />
      {environmentConfig.GENERAL_ENABLE_TRUSTARC === "true" && (
        <ClientComponentBridge
          {...props}
          clientComponentType="TrustarcCookiePopup"
          itemExpandLogic="emptyitem"
          env={environmentConfig}
        />
      )}
    </>
  );
};

export default ClientHandlerRoot;
