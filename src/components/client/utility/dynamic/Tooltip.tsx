import React, { useState, useRef } from "react";

import css from "./Tooltip.module.scss";
import { cssv, csx } from "@src/lib/utility/stylings/classes";
import {
  FormExclamationCircle,
  FormQuestionIcon,
} from "@src/components/server/utility/IconSVGFile";
import { useOnClickOutside } from "@src/clientlib/hooks";

interface TooltipProps {
  content?: React.ReactNode;
  error?: boolean;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  bubbleWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { top, right, bottom, left } = props;
  const [toggled, setToggled] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { content, error, bubbleWidth } = props;

  useOnClickOutside(ref, () => setToggled(false));
  return (
    <div
      className={css.container}
      ref={ref}
      style={cssv({ top, right, bottom, left })}
    >
      <div
        className={csx(css, "icon", { error })}
        onClick={() => setToggled(!toggled)}
      >
        {error ? (
          <FormExclamationCircle width={15} height={15} color={"#dc3545"} />
        ) : (
          <FormQuestionIcon width={18} height={18} />
        )}
      </div>
      {toggled && (
        <div
          className={`${css.bubble} ${error ? css.errorTip : css.questiontip}`}
          style={cssv({ bubbleWidth })}
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      )}
    </div>
  );
};

export default Tooltip;
