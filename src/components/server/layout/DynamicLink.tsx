import "server-only";

import Link from "next/link";
import Util from "@serverlib/utility";

interface DynamicLinkProps {
  slug: string;
  className?: string;
  title?: string;
  target?: string;
  dataTrackingKey?: string;
  dataTealiumEvent?: string;
  isDownload?: boolean;
  isVideo?: boolean;
  isPopup?: boolean;
  children?: React.ReactNode;
  dataAttributes?: { [key: string]: string | number };
  noFollow?: boolean;
  overRideLinkType?: string;
  skipInternalLinkCheck?: boolean;
}

const DynamicLink = ({
  slug,
  title,
  dataTrackingKey,
  isVideo = false,
  isDownload = false,
  isPopup = false,
  target = "",
  children,
  className,
  dataAttributes,
  noFollow,
  overRideLinkType,
  skipInternalLinkCheck = false,
}: DynamicLinkProps) => {
  let linkType = "";
  let href = "";
  let rel = "";

  if (/calendly/.test(slug)) {
    linkType = "calendly";
    href = slug;
  } else if (slug.startsWith("https://") || slug.startsWith("http://")) {
    linkType = overRideLinkType || "external";
    href = slug;
    target = target || "_blank";
  } else if (slug.startsWith("mailto:")) {
    linkType = "mail";
    href = slug;
  } else if (slug.startsWith("tel:")) {
    linkType = "tel";
    href = slug;
  } else if (slug.startsWith("#trustArc")) {
    linkType = "trustArc";
    href = slug;
  } else if (slug.startsWith("#")) {
    linkType = "anchor";
    href = slug;
    rel = slug.replace("#", "");
  } else {
    linkType = "internal";
    href = skipInternalLinkCheck ? slug : Util.addLocalePrefix(slug);
  }

  if (isDownload) {
    linkType = "download";
    href = slug;
    target = target || "_blank";
  }

  rel = Util.getRelAttribute(target, noFollow);

  if (rel) {
    if (dataAttributes) {
      dataAttributes.rel = rel;
    }
  }

  if (linkType === "calendly") {
    dataAttributes = dataAttributes || {
      "data-calendly": "true",
      "data-href": href,
      rel: rel,
      "data-tracking-key": Util.kebabCase(dataTrackingKey || title || ""),
    };
    return (
      <span className={className} {...dataAttributes}>
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </span>
    );
  }

  if (["external", "download", "mail", "tel"].includes(linkType)) {
    const parentID = Util.generateRandomString(10);
    dataAttributes = dataAttributes || {
      "data-tealium-event": linkType,
      "data-href": href,
      "data-target": target,
      rel: rel,
      "data-tracking-key": Util.kebabCase(dataTrackingKey || title || ""),
      "data-parent-id": parentID,
    };
    return (
      <a
        href={href}
        title={href}
        target={target}
        {...dataAttributes}
        id={parentID}
        className={className}
      >
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </a>
    );
  }

  if (linkType === "trustArc") {
    dataAttributes = dataAttributes || {
      "data-trustarc": "true",
      rel: rel,
      "data-tracking-key": Util.kebabCase(dataTrackingKey || title || ""),
    };
    return (
      <span
        className={`truste_cursor_pointer ${className}`}
        {...dataAttributes}
      >
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </span>
    );
  }

  if (linkType === "anchor") {
    dataAttributes = dataAttributes || {
      "data-anchor-link": "true",
      "data-anchor-target": href,
      rel: slug.replace("#", ""),
      "data-tracking-key": Util.kebabCase(dataTrackingKey || title || ""),
    };
    return (
      <span className={className} {...dataAttributes}>
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </span>
    );
  }

  if (isVideo) {
    rel = "noopener noreferrer";
    if (dataAttributes) {
      dataAttributes.rel = rel;
    }
    return (
      <span
        className={className}
        data-tracking-key={Util.kebabCase(dataTrackingKey || title || "")}
        {...dataAttributes}
      >
        {children}
      </span>
    );
  }

  if (isPopup) {
    return (
      <span
        className={className}
        data-tracking-key={Util.kebabCase(dataTrackingKey || title || "")}
        {...dataAttributes}
      >
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </span>
    );
  }

  if (linkType === "internal" && href.includes("#")) {
    const [hrefPath, hrefAnchor] = href.split("#");

    dataAttributes = {
      ...dataAttributes,
      "data-anchor-link": "true",
      "data-anchor-target": `#${hrefAnchor}`,
      "data-tracking-key": Util.kebabCase(dataTrackingKey || title || ""),
    };

    return (
      <Link
        href={href}
        title={title}
        as={href}
        target={target}
        data-tracking-key={Util.kebabCase(dataTrackingKey || title || "")}
        className={className}
        {...dataAttributes}
      >
        {dataAttributes
          ? Util.addAttributesToChildren(children, dataAttributes)
          : children}
      </Link>
    );
  }

  return slug ? (
    <Link
      href={href}
      title={title}
      as={href}
      target={target}
      data-tracking-key={Util.kebabCase(dataTrackingKey || title || "")}
      className={className}
      {...dataAttributes}
    >
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
};

export default DynamicLink;
