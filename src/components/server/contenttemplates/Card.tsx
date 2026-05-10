import { ContentFields } from "@lib/types";
import css from "./Card.module.scss";
import { _cx, cssv } from "@src/lib/utility/stylings/classes";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import Video from "@server/commontemplates/Video";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";

const cx = _cx(css);

export type CardItemProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      mobileImagePosition?: "top" | "bottom";
      borderRadius?: string;
    };
  }
>;

const Card = (props: CardItemProps) => {
  const { item } = props;
  const {
    textContent,
    image = [],
    video = [],
    buttons,
    custom,
    videoUrl = [],
    anchor,
  } = item.fields;
  const { mobileImagePosition, borderRadius } = custom || {};

  const { bodyContent } = textContent || {};
  const { startH, fnIdToNumber, clientId } = item.calculated || {};
  const mobileImage = image[1] || image[0];

  const hasAsset =
    (video && video.length > 0) ||
    (videoUrl && videoUrl.length > 0) ||
    (image && image.length > 0);

  return (
    <div
      className={cx("wrapper", {
        withOutAsset: !hasAsset,
      })}
      {...(anchor && {
        "data-anchor-id": anchor,
      })}
    >
      <div
        className={cx("mainSection", {
          mobileColumnReverse: mobileImagePosition === "bottom",
        })}
      >
        {hasAsset && (
          <div
            className={cx("assetContainer")}
            style={cssv({
              borderRadius: borderRadius === "none" ? "0" : 5,
            })}
          >
            <div
              className={cx("assetContainerInner")}
              {...Util.renderContentfulDataAttributes(clientId || "", "image")}
            >
              {(video && video.length) || (videoUrl && videoUrl.length) ? (
                <Video
                  video={video[0]}
                  src={videoUrl[0]}
                  image={image[0]}
                  playIconSize="md"
                  clientId={clientId}
                />
              ) : (
                <>
                  <div className={cx("show-on-desktop")}>
                    {image[0] && (
                      <ResponsiveImage
                        image={image[0]}
                        screenWidth="half"
                        alt={
                          image[0].fields.description ||
                          image[0].fields.title ||
                          ""
                        }
                      />
                    )}
                  </div>

                  <div className={cx("show-on-mobile")}>
                    {mobileImage && (
                      <ResponsiveImage
                        image={mobileImage}
                        alt={
                          mobileImage.fields.description ||
                          mobileImage.fields.title ||
                          ""
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {textContent && (
          <div
            {...Util.renderContentfulDataAttributes(
              clientId || "",
              "textContent",
            )}
          >
            <HeaderText
              textContent={textContent}
              startH={startH}
              headingClassNumer={5}
              fnNumbers={fnIdToNumber}
            />
          </div>
        )}
      </div>

      <div
        className={cx("contentContainer")}
        {...Util.renderContentfulDataAttributes(clientId || "", "textContent")}
      >
        {bodyContent && (
          <div>
            <ContentText bodyContent={bodyContent} fnNumbers={fnIdToNumber} />
          </div>
        )}

        {buttons && (
          <div>
            <CTAList buttons={buttons} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
