import "server-only";

import { ReactNode, createElement } from "react";
import { _cx } from "@lib/utility/stylings/classes";
import {
  Block,
  Inline,
  BLOCKS,
  MARKS,
  Document,
  INLINES,
} from "@contentful/rich-text-types";
import css from "./ContentText.module.scss";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import DynamicLink from "@server/layout/DynamicLink";
import Util from "@serverlib/utility";
import { cssvFontColor } from "@lib/utility/stylings/classes";

const cx = _cx(css);

type GetBodyCopyOptionsProps = {
  tagName?: string;
  className?: string;
  startFn?: number;
  dataAttributes?: { [key: string]: string };
  fnNumbers?: Record<string, number>;
  headingStrong?: boolean;
  backgroundFontColor?: string;
};

const extractParagraphClassFromNode = (
  node: Block | Inline
): string | undefined => {
  if (!("content" in node)) return undefined;

  for (const child of node.content) {
    if (
      child.nodeType === INLINES.EMBEDDED_ENTRY &&
      child.data?.target?.fields?.title
    ) {
      return child.data.target.fields.title;
    }
  }

  return undefined;
};

const reanderBlockNodes = ({
  tagName,
  className,
  dataAttributes,
  fnNumbers,
  headingStrong,
  backgroundFontColor,
}: GetBodyCopyOptionsProps) => {
  let paragraphClass: string | undefined;
  let pareCount = 1;
  return {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (
        node: Block | Inline,
        children: ReactNode
      ): ReactNode => {
        const paragraphClass = extractParagraphClassFromNode(node);
        const commonClassNames = {
          [`textTransform-${paragraphClass}`]: [
            "capitalize",
            "uppercase",
            "lowercase",
            "none",
          ].includes(paragraphClass ?? ""),
          [`textWrap-${paragraphClass}`]: ["wrap", "nowrap"].includes(
            paragraphClass ?? ""
          ),
        };
        const fontColorToken = paragraphClass
          ?.split(/\s+/)
          .find((token) => token.startsWith("fontColor-"))
          ?.replace("fontColor-", "");
        const style: React.CSSProperties | undefined = fontColorToken
          ? { color: `var(--bkgColor-${fontColorToken})` }
          : {
              color: backgroundFontColor
                ? cssvFontColor(backgroundFontColor)
                : undefined,
            };
        if (tagName) {
          let containsStrong = false;
          if (headingStrong) {
            containsStrong = Util.hasMatchingChildElement(children, "strong");
          }
          return createElement(
            tagName,
            {
              className: cx(
                paragraphClass,
                className,
                {
                  textTransformInitial:
                    (!containsStrong && headingStrong) || false,
                  headingSupScript: true,
                },
                commonClassNames
              ),
              ...dataAttributes,
              style: {
                ...style,
              },
            },
            children
          );
        }
        return (
          <p
            className={cx(
              paragraphClass,
              "bodyText",
              className,
              {
                ["quoteAttribution" +
                (pareCount < 3 ? pareCount++ : pareCount)]:
                  className?.includes("quote"),
              },
              commonClassNames
            )}
            {...dataAttributes}
            style={style}
          >
            {children}
          </p>
        );
      },
      [BLOCKS.LIST_ITEM]: (node: Block | Inline, children: ReactNode) => {
        return (
          <li className={cx("list-item", className)} {...dataAttributes}>
            {children}
          </li>
        );
      },
      [BLOCKS.OL_LIST]: (node: Block | Inline, children: ReactNode) => {
        return (
          <div className={css["list-wrapper"]}>
            <ol
              className={cx("ordered-list", paragraphClass)}
              {...dataAttributes}
            >
              {children}
            </ol>
          </div>
        );
      },
      [BLOCKS.UL_LIST]: (node: Block | Inline, children: ReactNode) => {
        return (
          <div className={css["list-wrapper"]}>
            <ul className={css["unordered-list"]} {...dataAttributes}>
              {children}
            </ul>
          </div>
        );
      },
      [BLOCKS.QUOTE]: (node: Block | Inline, children: ReactNode) => {
        return (
          <blockquote className={cx("quoteAttribution1")}>
            {children}
          </blockquote>
        );
      },
      [BLOCKS.HR]: (node: Block | Inline, children: ReactNode) => {
        return <hr className={css["hr"]} role="presentation" />;
      },
      [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => {
        return (
          <span role="a">
            <DynamicLink
              slug={node.data.uri}
              className={cx("link", "globalLink")}
              {...dataAttributes}
            >
              {children}
            </DynamicLink>
          </span>
        );
      },
      [INLINES.ENTRY_HYPERLINK]: (
        node: Inline | Block,
        children: ReactNode
      ) => {
        const footnoteId = node.data?.target?.id;
        if (fnNumbers && fnNumbers[footnoteId]) {
          const footnote = fnNumbers[footnoteId];
          return (
            <sup
              {...Util.renderContentfulDataAttributes(footnoteId, "footnote")}
              {...dataAttributes}
              className={css["footnote-link"]}
            >
              <DynamicLink
                slug={`#footnote-${footnote}`}
                className={css["footnoteLink"]}
                {...dataAttributes}
              >
                {footnote}
              </DynamicLink>
            </sup>
          );
        }

        let slug = node.data?.target?.fields?.slug;

        return (
          <span role="a" {...dataAttributes}>
            <DynamicLink
              slug={slug || ""}
              className={css["link"]}
              {...dataAttributes}
            >
              {children}
            </DynamicLink>
          </span>
        );
      },
      [INLINES.EMBEDDED_ENTRY]: (node: Block | Inline, children: ReactNode) => {
        if (node.data?.target?.fields?.title) {
          paragraphClass = node.data.target.fields.title;
        }
        return <></>;
      },
    },
  };
};

const renderMarkNodes = ({
  headingStrong,
  dataAttributes,
}: GetBodyCopyOptionsProps) => {
  return {
    renderMark: {
      [MARKS.SUPERSCRIPT]: (text: ReactNode) => {
        const reg = /^\d+$/;
        const isNumber = reg.test(text as string);
        return (
          <sup
            {...dataAttributes}
            className={isNumber ? css["footnote-link"] : ""}
          >
            {text}
          </sup>
        );
      },
      [MARKS.BOLD]: (text: ReactNode) => {
        return (
          <strong
            className={cx({
              heroTitle1: headingStrong,
            })}
            {...dataAttributes}
          >
            {text}
          </strong>
        );
      },
      [MARKS.ITALIC]: (text: ReactNode) => {
        return <em {...dataAttributes}>{text}</em>;
      },
      [MARKS.UNDERLINE]: (text: ReactNode) => {
        return <u {...dataAttributes}>{text}</u>;
      },
      [MARKS.CODE]: (text: ReactNode) => {
        return <code {...dataAttributes}>{text}</code>;
      },
    },
  };
};

// render text with strikethrough formatting (~~text~~) and line breaks with shift + enter
const renderText = () => {
  const processStrikethrough = (
    nodes: React.ReactNode[],
    index: number
  ): React.ReactNode[] => {
    return nodes.flatMap((node, i) => {
      if (typeof node !== "string") return node;

      return node.split(/(~~.*?~~)/g).map((segment, j) => {
        if (segment.match(/~~.+~~/)) {
          return (
            <s key={`s-${index}-${i}-${j}`}>{segment.replace(/~~/g, "")}</s>
          );
        }
        return segment;
      });
    });
  };

  const processColor = (text: string, index: number): React.ReactNode[] => {
    return text.split(/(\[color=.*?\].*?\[\/color\])/g).map((segment, i) => {
      const match = segment.match(/\[color=(.*?)\](.*?)\[\/color\]/);

      if (match) {
        const [, color, content] = match;
        return (
          <span
            key={`color-${index}-${i}`}
            style={{ color: `var(--bkgColor-${color})` }}
          >
            {content}
          </span>
        );
      }

      return segment;
    });
  };

  return {
    renderText: (text: string): React.ReactNode[] => {
      return text.split("\n").flatMap((line, index) => {
        let nodes: React.ReactNode[] = [];

        nodes = processColor(line, index);
        nodes = processStrikethrough(nodes, index);
        return index > 0 ? [<br key={`br-${index}`} />, ...nodes] : nodes;
      });
    },
  };
};

const getBodyCopyOptions = ({
  tagName,
  className,
  headingStrong,
  dataAttributes,
  fnNumbers,
}: GetBodyCopyOptionsProps) => {
  return {
    ...reanderBlockNodes({
      tagName,
      className,
      dataAttributes,
      fnNumbers,
      headingStrong,
    }),
    ...renderMarkNodes({ headingStrong, dataAttributes }),
    ...renderText(),
  };
};

type ContentTextProps = {
  bodyContent: Document;
  tagName?: string;
  className?: string;
  headingStrong?: boolean;
  // startFn?: number;
  dataAttributes?: { [key: string]: string };
  fnNumbers?: Record<string, number>;
};

const ContentText = (props: ContentTextProps) => {
  const {
    bodyContent,
    tagName,
    className,
    headingStrong,
    dataAttributes,
    fnNumbers,
  } = props;
  if (!bodyContent) return null;

  const bodyCopyOptions = getBodyCopyOptions({
    tagName,
    className,
    headingStrong,
    dataAttributes,
    fnNumbers,
  });

  return <>{documentToReactComponents(bodyContent, bodyCopyOptions)}</>;
};

export default ContentText;

export const renderOnlyText = (bodyContent?: Document): string => {
  if (!bodyContent) return "";

  const extractText = (node: any): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "object" && node.content) {
      return node.content.map(extractText).join(" ");
    }
    if (typeof node === "object" && node.value) {
      return node.value;
    }
    return "";
  };

  return extractText(bodyContent);
};

// create a function that takes a string and returns Document
export const renderStringToDocument = (text: string): Document => {
  const doc: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: "text",
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  };
  return doc;
};

const markTypeHandlers: Record<string, (text: string) => string> = {
  [MARKS.BOLD]: (text) => `<strong>${text}</strong>`,
  [MARKS.ITALIC]: (text) => `<em>${text}</em>`,
  [MARKS.UNDERLINE]: (text) => `<u>${text}</u>`,
  [MARKS.CODE]: (text) => `<code>${text}</code>`,
  [MARKS.SUPERSCRIPT]: (text) => `<sup>${text}</sup>`,
};

const nodeTypeHandlers: Record<
  string,
  (node: any, render: (node: any) => string) => string
> = {
  [BLOCKS.PARAGRAPH]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim() ? `<p>${contentHtml}</p>` : "";
  },
  [BLOCKS.QUOTE]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim() ? `<blockquote>${contentHtml}</blockquote>` : "";
  },
  [BLOCKS.LIST_ITEM]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim() ? `<li>${contentHtml}</li>` : "";
  },
  [BLOCKS.OL_LIST]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim() ? `<ol>${contentHtml}</ol>` : "";
  },
  [BLOCKS.UL_LIST]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim() ? `<ul>${contentHtml}</ul>` : "";
  },
  [BLOCKS.HR]: () => `<hr />`,
  [INLINES.HYPERLINK]: (node, render) => {
    const contentHtml = node.content.map(render).join("");
    return contentHtml.trim()
      ? `<a href="${node.data.uri}">${contentHtml}</a>`
      : "";
  },
};

export const renderContentToHtml = (document?: Document): string => {
  if (!document || !document.content || document.content.length === 0)
    return "";

  const renderNodeToHtml = (node: any): string => {
    if (typeof node === "string") return node;

    if (node.nodeType === "text") {
      const textValue = node.value || "";
      if (node.marks?.length) {
        return node.marks.reduce((text: string, mark: { type: string }) => {
          const markHandler = markTypeHandlers[mark.type];
          return markHandler ? markHandler(text) : text;
        }, textValue);
      }
      return textValue;
    }

    if (nodeTypeHandlers[node.nodeType]) {
      return nodeTypeHandlers[node.nodeType](node, renderNodeToHtml);
    }

    if (node.content) {
      return node.content.map(renderNodeToHtml).join("");
    }

    return node.value || "";
  };

  const renderText = (text: string): string => {
    // Process custom strikethrough formatting (~~text~~)
    const processedStrikethrough = text.replace(/~~(.*?)~~/g, "<s>$1</s>");
    // Replace newlines with <br /> for multi-line content
    return processedStrikethrough.replace(/\n/g, "<br />");
  };

  return renderText(renderNodeToHtml(document));
};
