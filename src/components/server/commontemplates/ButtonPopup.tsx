import "server-only";

import { ContentFields } from "@src/lib/types";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import { cssv, csx, _cx } from "@lib/utility/stylings/classes";
import css from "./ButtonPopup.module.scss";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";

const cx = _cx(css);

type ButtonPopupProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {};
  }
>;

const ButtonPopup = (props: ButtonPopupProps) => {
  const { item } = props;
  const { id, fields } = item;
  const { buttons, custom = {}, textContent = {} } = fields;
  const { bodyContent } = textContent || {};
  const { startH } = item.calculated || {};
  const { alignItems = "center" } = custom;

  return (
    <div id={`buttonModal_${id}`} className="d-none">
      <div
        className={csx(css, "contentContainer")}
        style={cssv({ alignItems })}
      >
        <div
          {...Util.renderContentfulDataAttributes(id || "", "textContent")}
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

        {buttons && <CTAList buttons={buttons} />}
      </div>
    </div>
  );
};

export default ButtonPopup;
