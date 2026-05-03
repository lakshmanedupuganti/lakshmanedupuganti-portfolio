import "server-only";

import { ButtonEntry } from "@src/lib/types";
import css from "./CTAList.module.scss";
import Button from "./Button";
import { csx } from "@lib/utility/stylings/classes";

interface CTAListProps {
  buttons: ButtonEntry[];
  clientId?: string;
  minWidth?: string;
  minWidthMobile?: string;
}

const CTAList = ({
  buttons,
  minWidth = "auto",
  minWidthMobile = "100",
}: CTAListProps) => {
  const filteredButtons = buttons.filter((button) => !!button);
  const centerAlign = buttons.some(
    (button) => button.fields.align === "center"
  );

  return (
    <div className={csx(css, "styling", { center: centerAlign })}>
      {filteredButtons.map((button, key) => {
        return (
          <Button
            key={key}
            {...button.fields}
            $minWidth={minWidth}
            $minWidthMobile={minWidthMobile}
            entryId={button.id}
          />
        );
      })}
    </div>
  );
};

export default CTAList;
