import { ContentFields } from "@src/lib/types";
import css from "./CardWithCounter.module.scss";
import { _cx } from "@src/lib/utility/stylings/classes";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";

const cx = _cx(css);

type CardWithCounterProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      prefix?: string;
      suffix?: string;
      value?: string;
    };
  }
>;

const CardWithCounter = (props: CardWithCounterProps) => {
  const { item } = props;
  const { textContent, buttons, custom, anchor } = item.fields;
  const { prefix, suffix, value } = custom || {};
  const { clientId } = item.calculated || {};

  const { bodyContent } = textContent || {};
  const { startH, fnIdToNumber } = item.calculated || {};
  return (
    <div
      className={cx("wrapper")}
      {...(anchor && {
        "data-anchor-id": anchor,
      })}
    >
      <div className={cx("counterContainer")}>
        <div
          className={cx("counter")}
          {...Util.renderContentfulDataAttributes(clientId || "", "custom")}
        >
          {prefix && <span className={cx("counterprefix")}>{prefix}</span>}
          {value && (
            <span data-counter={`${clientId}`} data-counter-value={value}>
              0
            </span>
          )}
          {suffix && <span>{suffix}</span>}
        </div>
      </div>
      <div
        className={cx("contentContainer")}
        {...Util.renderContentfulDataAttributes(clientId || "", "textContent")}
      >
        {textContent && (
          <div>
            <HeaderText
              textContent={textContent}
              startH={startH}
              headingClassNumer={5}
              fnNumbers={fnIdToNumber}
            />
          </div>
        )}

        {bodyContent && (
          <div>
            <ContentText bodyContent={bodyContent} fnNumbers={fnIdToNumber} />
          </div>
        )}

        {buttons && (
          <div>
            <CTAList buttons={buttons} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardWithCounter;
