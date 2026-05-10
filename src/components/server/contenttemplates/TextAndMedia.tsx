import "server-only";

import { ContentFields, SliderProperties } from "@src/lib/types";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import css from "./TextAndMedia.module.scss";
import { _cx, cssv } from "@src/lib/utility/stylings/classes";
import { Col, Row } from "@server/utility/Bootstrap";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";
import RenderImage, {
  RenderAssetContainerProps,
} from "@server/commontemplates/RenderImage";

const cx = _cx(css);

type TextAndMediaProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      languages?: {
        language: string;
        proficiencyLevel: string;
      }[];
      imageOrientation?: "left" | "right";
      mobileImagePosition?: "top" | "bottom";
    };
  }
>;

const TextAndMedia = (props: TextAndMediaProps) => {
  const { item } = props;
  const {
    textContent,
    buttons,
    image = [],
    custom,
    video = [],
    anchor,
  } = item.fields;
  const { bodyContent } = textContent || {};
  const {
    imageOrientation = "right",
    mobileImagePosition = "bottom",
    languages = [],
  } = custom || {};
  const { startH, clientId, fnIdToNumber } = item.calculated || {};

  if (!textContent && !image.length && !video.length) return null;

  if (!textContent && video.length) {
    return (
      <div
        className={cx("wrapper", "fullVideoWrapper")}
        {...(anchor && {
          "data-anchor-id": anchor,
        })}
      >
        <div className={cx("assetContainer")}>
          {renderAssetContainer(props, "show-on-mobile", "Mobile")}
          {renderAssetContainer(props, "show-on-desktop", "Desktop")}
        </div>
      </div>
    );
  }

  if (!textContent && image.length && !video.length) {
    return (
      <div
        className={cx("fullWidthImage")}
        {...(anchor && {
          "data-anchor-id": anchor,
        })}
      >
        <RenderImage image={image} mode="background" />
      </div>
    );
  }
  console.log("languages", languages);

  return (
    <div
      className={cx("wrapper", "textAndMedia")}
      style={cssv({
        width: "100%",
      })}
      {...(anchor && {
        "data-anchor-id": anchor,
      })}
    >
      <Row
        className={cx(
          {
            "flex-row-reverse": imageOrientation === "left",
          },
          "mainSection",
        )}
      >
        <Col
          md={7}
          lg={7}
          xl={7}
          sm={12}
          className={cx("textContainer", "textAndMedia_textContainer")}
        >
          <div
            className={cx("textContainerInner")}
            {...Util.renderContentfulDataAttributes(
              clientId || "",
              "textContent",
            )}
          >
            {textContent && (
              <HeaderText
                startH={startH}
                textContent={{
                  eyebrow: textContent.eyebrow,
                  headline: textContent.headline,
                }}
                fnNumbers={fnIdToNumber}
              />
            )}
            <div
              className={cx(
                {
                  "flex-column-reverse": mobileImagePosition === "top",
                },
                "bodyContent",
              )}
            >
              {textContent && (
                <div>
                  <HeaderText
                    startH={startH}
                    textContent={{
                      subheadline: textContent.subheadline,
                    }}
                    fnNumbers={fnIdToNumber}
                  />
                  {bodyContent && (
                    <ContentText
                      bodyContent={bodyContent}
                      fnNumbers={fnIdToNumber}
                    />
                  )}
                  {languages?.length > 0 && (
                    <div className={cx("languages")}>
                      {languages.map(
                        (
                          language: {
                            language: string;
                            proficiencyLevel: string;
                          },
                          index,
                        ) => (
                          <div
                            key={`${language.language}-${index}`}
                            className={cx("languageCard")}
                          >
                            <span className={cx("languageName")}>
                              {language.language}
                            </span>

                            <span className={cx("separator")} />

                            <span className={cx("proficiencyLevel")}>
                              {language.proficiencyLevel}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

              {renderAssetContainer(props, "show-on-mobile", "Mobile")}
            </div>

            {buttons && (
              <div className={cx("buttonContainer")}>
                <CTAList buttons={buttons} />
              </div>
            )}
          </div>
        </Col>

        <Col md={5} lg={5} xl={5} sm={12} className={cx("show-on-desktop")}>
          {renderAssetContainer(props, "show-on-desktop", "Desktop")}
        </Col>
      </Row>
    </div>
  );
};

export default TextAndMedia;

// helper functions
const renderAssetContainer = (
  props: TextAndMediaProps,
  className: string,
  idType: "Mobile" | "Desktop",
) => {
  const { item } = props;
  const { clientId } = item.calculated || {};

  return (
    <div
      className={cx(
        "assetContainerInner",
        "textAndMedia_assetContainerInner",
        className,
      )}
      {...Util.renderContentfulDataAttributes(clientId || "", "image")}
      style={cssv({
        width: "80%",
      })}
    >
      <div className={cx("imageContainer")}>
        <RenderAssetContainerProps {...props} idType={idType} />
      </div>
    </div>
  );
};
