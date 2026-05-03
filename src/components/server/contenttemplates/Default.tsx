import "server-only";

import { ContentFields } from "@src/lib/types";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import { cssv, csx, _cx } from "@lib/utility/stylings/classes";
import css from "./Default.module.scss";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";

const cx = _cx(css);

type DefaultItemProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      alignItems?: "left" | "center" | "right";
    };
  }
>;

const Default = (props: DefaultItemProps) => {
  const { item } = props;
  const { buttons, custom = {}, textContent = {}, anchor } = item.fields;
  const { bodyContent } = textContent || {};
  const { startH, clientId } = item.calculated || {};
  const { alignItems = "center" } = custom;

  return (
    <>
      <div
        className={csx(css, "contentContainer")}
        style={cssv({ alignItems })}
        {...(anchor && {
          "data-anchor-id": anchor,
        })}
      >
        <div
          {...Util.renderContentfulDataAttributes(
            clientId || "",
            "textContent",
          )}
          className={cx("textContainer")}
        >
          {textContent && (
            <HeaderText textContent={textContent} startH={startH} />
          )}
          {bodyContent && (
            <div className={cx("bodyContent")}>
              <ContentText bodyContent={bodyContent} />
            </div>
          )}
        </div>

        {buttons && (
          <div className={cx("ctaList")}>
            <CTAList buttons={buttons} />
          </div>
        )}
      </div>
    </>
  );
};

export default Default;
