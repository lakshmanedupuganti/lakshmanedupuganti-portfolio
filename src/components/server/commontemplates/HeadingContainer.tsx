import "server-only";

import { Col } from "@server/utility/Bootstrap";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import { _cx } from "@src/lib/utility/stylings/classes";
import Util from "@serverlib/utility";
import type { TextContent } from "@src/lib/types";
import css from "./HeadingContainer.module.scss";

const cx = _cx(css);

type HeadingContainerProps = {
  textContent?: TextContent;
  startH?: number;
  fnIdToNumber?: Record<string, number>;
  clientId?: string;
  className?: string;
  additionalClasses?: Record<string, boolean>;
  showAsCol?: boolean;
  colProps?: {
    md?: number;
    lg?: number;
    xl?: number;
    sm?: number;
  };
  contentTextClassName?: string;
  bodyContentClassName?: string;
};

const HeadingContainer = ({
  textContent,
  startH,
  fnIdToNumber,
  clientId,
  className,
  additionalClasses = {},
  showAsCol = true,
  colProps = { md: 12, lg: 12, xl: 12, sm: 12 },
  contentTextClassName,
  bodyContentClassName,
}: HeadingContainerProps) => {
  const { bodyContent } = textContent || {};

  const containerClasses = cx(
    "commonHeadingContainer",
    {
      noHeadingContainer: !textContent,
      hasBodyContent: !!bodyContent,
      ...additionalClasses,
    },
    className,
  );

  const content = (
    <>
      {textContent && (
        <HeaderText
          startH={startH}
          textContent={textContent}
          fnNumbers={fnIdToNumber}
        />
      )}

      {bodyContent && (
        <div className={cx(contentTextClassName)}>
          <ContentText
            bodyContent={bodyContent}
            fnNumbers={fnIdToNumber}
            className={bodyContentClassName}
          />
        </div>
      )}
    </>
  );

  if (!showAsCol) {
    return (
      <div
        className={containerClasses}
        {...Util.renderContentfulDataAttributes(clientId || "", "textContent")}
      >
        {content}
      </div>
    );
  }

  return (
    <Col
      {...colProps}
      className={containerClasses}
      {...Util.renderContentfulDataAttributes(clientId || "", "textContent")}
    >
      {content}
    </Col>
  );
};

export default HeadingContainer;
