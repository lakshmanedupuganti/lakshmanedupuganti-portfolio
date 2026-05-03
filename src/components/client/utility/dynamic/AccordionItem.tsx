import {
  ChevronDown,
  ChevronUp,
} from "@src/components/server/utility/IconSVGFile";
import { _cx } from "@src/lib/utility/stylings/classes";
import css from "./AccordionItem.module.scss";

const cx = _cx(css);

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const AccordionComponent: React.FC<AccordionItemProps> = (props) => {
  const { title, children, isExpanded, onToggle } = props;

  const toggleAccordion = () => {
    onToggle();
  };

  return (
    <div className={cx("accordion")}>
      <div className={cx("header")} onClick={toggleAccordion}>
        {title}
        {isExpanded ? <ChevronUp 
            width={20}
            height={20}
        /> : <ChevronDown             width={20}
        height={20} />}
      </div>
      <div
        className={cx("section", {
          expanded: isExpanded,
        })}
      >
        <div className={cx("content")}>{children}</div>
      </div>
    </div>
  );
};

export default AccordionComponent;
