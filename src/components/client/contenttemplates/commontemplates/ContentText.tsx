import { BLOCKS, MARKS, Document, INLINES } from "@contentful/rich-text-types";

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

export const getPlainText = (document?: Document): string => {
  if (!document || !document.content || document.content.length === 0)
    return "";

  const extractTextFromNode = (node: any): string => {
    if (typeof node === "string") return node;

    if (node.nodeType === "text") {
      return node.value || "";
    }

    if (node.content) {
      return node.content.map(extractTextFromNode).join("");
    }

    return node.value || "";
  };

  return document.content.map(extractTextFromNode).join("").trim();
};
