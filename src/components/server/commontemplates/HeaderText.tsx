import "server-only";

import ContentText from "./ContentText";
import { TextContent } from "@src/lib/types";

type HeadingTagsType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HEADING_TAGS: HeadingTagsType[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

const getHeadingClass = (
  type: keyof TextContent,
  count: number,
  headingClassNumer?: number,
  useHeroTitles?: boolean,
): string => {
  if (type === "eyebrow") {
    return "eyeBrow";
  }
  if (type === "headline") {
    if (useHeroTitles) {
      return "heroTitle2";
    }
    if (headingClassNumer) {
      return `displayTitle${headingClassNumer}`;
    }
    return `displayTitle${count + 1}`;
  }
  if (type === "subheadline") {
    return "subTitle";
  }
  return "headline" + count;
};

interface HeaderTextProps {
  textContent?: TextContent;
  startH?: number;
  useHeroTitles?: boolean;
  headingClassNumer?: number;
  fnNumbers?: Record<string, number>;
  dataAttributes?: { [key: string]: string };
}

const HeaderText = (props: HeaderTextProps) => {
  const {
    textContent,
    startH = 1,
    useHeroTitles,
    headingClassNumer,
    fnNumbers,
    dataAttributes,
  } = props;
  if (!textContent) return null;
  const { eyebrow, headline, subheadline } = textContent;
  let count = 0;
  let selectHeading = startH;

  if (selectHeading >= HEADING_TAGS.length - 1) {
    selectHeading = HEADING_TAGS.length - 2;
  }

  return (
    <>
      {[eyebrow, headline, subheadline].map((heading, i) => {
        if (!heading) return null;

        const headingType = Object.keys(textContent).find(
          (key) => textContent[key as keyof TextContent] === heading,
        );

        const headingTag = HEADING_TAGS[selectHeading + count];
        count++;

        const headingClass = getHeadingClass(
          headingType as keyof TextContent,
          count,
          headingClassNumer,
          useHeroTitles,
        );

        if (headingType === "eyebrow" && startH === 0) {
          count--;
          return (
            <ContentText
              key={i}
              bodyContent={heading}
              className={headingClass}
              tagName="span"
              headingStrong={useHeroTitles}
              fnNumbers={fnNumbers}
              dataAttributes={dataAttributes}
            />
          );
        } else if (headingType === "eyebrow" && startH !== 0) {
          count--;
        }

        return (
          <ContentText
            key={i}
            bodyContent={heading}
            className={headingClass}
            tagName={headingTag}
            headingStrong={useHeroTitles}
            fnNumbers={fnNumbers}
            dataAttributes={dataAttributes}
          />
        );
      })}
    </>
  );
};

export default HeaderText;
