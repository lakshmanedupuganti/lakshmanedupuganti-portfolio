import "server-only";

import { ButtonFields } from "@src/lib/types";
import DynamicLink from "@server/layout/DynamicLink";
import css from "./Button.module.scss";
import {
  cssv,
  cssvbtnColor,
  cssvbtnFontSize,
  cssvbtnHeight,
  cssvbtnHoverColor,
  cssvbtnPadding,
  csx,
  _cx,
} from "@lib/utility/stylings/classes";
import Util from "@serverlib/utility";
import { Button } from "@server/utility/Bootstrap";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import { RightCircleArrow } from "@server/utility/IconSVGFile";

const cx = _cx(css);

type ButtonProps = ButtonFields & React.HTMLAttributes<HTMLDivElement>;

const ButtonComp = (props: ButtonProps) => {
  let {
    disabled,
    dataTrackingKey,
    size,
    color,
    calculatedUrl,
    target,
    isDownload,
    isVideo,
    variant,
    label,
    children,
    image,
    align,
    className,
    buttonIcon,
    dataAttributes,
    entryId,
    noFollow,
    showOnlyOn,
    popup,
  } = props;
  const slug = calculatedUrl;
  const buttonProps = {
    "data-tracking-key": Util.kebabCase(dataTrackingKey || label || ""),
    disabled,
    className: csx(
      css,
      className,
      "styledButton",
      "buttonText",
      "globalButton",
      {
        [variant || "primary"]: true,
        link2: variant === "link",
      }
    ),
    style: cssv({
      btnHeight: cssvbtnHeight(size),
      btnPadding: cssvbtnPadding(size),
      btnFontSize: cssvbtnFontSize(size),
      btnColor: cssvbtnColor(color),
      btnHoverColor: cssvbtnHoverColor(color),
    }),
    variant: variant || "primary",
    "aria-label": label || "button",
    ...{
      ...(Util.getRelAttribute(target, noFollow)
        ? { rel: Util.getRelAttribute(target, noFollow) }
        : {}),
    },
  };

  if(popup) {
    const { template } = popup.fields;
    dataAttributes = {
      ...dataAttributes,
      "data-toggle": template === "FormPopup" ? "formPopup" : "modal",
      "data-target": `#buttonModal_${popup.id}`,
      "data-toggle-size": "lg",
      "data-toggle-class": "buttonModal",
    }
  }
  return (
    <div
      className={cx("container", {
        [showOnlyOn || ""]: true,
      })}
      {...{
        ...dataAttributes,
        ...Util.renderContentfulDataAttributes(entryId || "", "button"),
      }}
    >
      <DynamicLink
        slug={!disabled ? slug || "" : ""}
        target={target}
        dataTrackingKey={dataTrackingKey || label || ""}
        isDownload={isDownload}
        isVideo={isVideo}
        isPopup={!!popup}
        dataAttributes={dataAttributes}
        noFollow={noFollow}
      >
        {variant !== "image" && (
          <Button {...buttonProps} {...(dataAttributes ? dataAttributes : {})}>
            {!children ? (
              <span
                className={csx(css, {
                  link2: variant === "link",
                  buttonText: variant !== "link",
                })}
                {...dataAttributes}
                dangerouslySetInnerHTML={{ __html: label || "" }}
              />
            ) : (
              children
            )}
            {(buttonIcon || variant === "link") && (
              <span className={css.linkbuttonArrow} {...dataAttributes}>
                {buttonIcon ? (
                  <ResponsiveImage
                    image={buttonIcon}
                    alt={buttonIcon?.fields?.description || "Button Icon"}
                    {...dataAttributes}
                  />
                ) : (
                  <RightCircleArrow {...dataAttributes} />
                )}
              </span>
            )}
          </Button>
        )}

        {variant === "image" && (
          <div
            className={csx(css, "imageButton", className, {
              active: !disabled && !!slug,
              center: align === "center",
            })}
            style={cssv({
              btnHeight: cssvbtnHeight(size),
            })}
            {...dataAttributes}
          >
            <ResponsiveImage
              image={image}
              alt={image?.fields?.description || "Buttom Image"}
              {...dataAttributes}
            />
          </div>
        )}
      </DynamicLink>
    </div>
  );
};

export default ButtonComp;
