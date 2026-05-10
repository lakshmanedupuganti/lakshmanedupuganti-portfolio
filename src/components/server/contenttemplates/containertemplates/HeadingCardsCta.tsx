import "server-only";

import { ContainerHeadingCardsCtaFields } from "@src/lib/types";
import { Col, Row } from "@server/utility/Bootstrap";
import css from "./HeadingCardsCta.module.scss";
import CTAList from "@server/commontemplates/CTAList";
import { _cx, cssv, cssvBkgColor } from "@src/lib/utility/stylings/classes";
import Util from "@serverlib/utility";
import {
  CarouselNextIcon,
  CarouselPrevIcon,
} from "@server/utility/IconSVGFile";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import type {
  ContentEntry,
  ServerContentItemComponentProps,
} from "@lakshmanedupuganti/server-library";
import ClientComponentBridge from "@server/utility/ClientComponentBridge";
import HeadingContainer from "@server/commontemplates/HeadingContainer";

const cx = _cx(css);

type TemplateSettingsProps = {
  md: { span: number; order?: number };
  lg: { span: number; order?: number };
  xl: { span: number; order?: number };
  carouselMobile?: boolean;
};

type HeadingCardsCtaProps = ServerContentItemComponentProps<
  ContainerHeadingCardsCtaFields & {
    custom?: {
      isResponsiveSideBySide?: boolean;
    };
  }
>;

const HeadingCardsCta = (props: HeadingCardsCtaProps) => {
  const { item, renderContentItemComponent } = props;
  const { startH, clientId, fnIdToNumber } = item.calculated || {};
  const {
    contents,
    textContent,
    buttons,
    template,
    backgroundColor = "none",
    image,
    custom,
    anchor,
  } = item.fields;
  const { bodyContent } = textContent || {};
  const { isResponsiveSideBySide } = custom || {};
  const templateName = template || "one column";
  const templateObj =
    TemplateSettings[templateName] || TemplateSettings["one column"];
  const templateCarouselMobile = templateObj?.carouselMobile || false;
  const templateClassName = Util.toCamelCase(templateName);
  const parentClientId = clientId;

  if ((!contents || !contents.length) && !buttons && image) {
    return renderFullWidthImage(props);
  }

  const renderEnvelope = (item: ContentEntry, index: number) => {
    const { calculated } = item;
    const { idx } = calculated || {};

    const colSizes: Record<string, number> = {
      xs: isResponsiveSideBySide ? 6 : 12,
      sm: isResponsiveSideBySide ? 6 : 12,
    };
    Object.keys(templateObj).forEach((k) => {
      const colSettings = templateObj[k as keyof TemplateSettingsProps];

      if (
        typeof colSettings === "object" &&
        colSettings.hasOwnProperty("span")
      ) {
        colSizes[k as keyof TemplateSettingsProps] = colSettings.span || 12;
      }
    });

    const hasBackgroundColor =
      typeof backgroundColor === "string" &&
      backgroundColor.trim() !== "" &&
      backgroundColor.toLowerCase() !== "none";

    return (
      <Col
        key={`#${clientId}_${(index || 0) + 1}`}
        data-idx={idx}
        id={"slideinit_" + parentClientId}
        {...colSizes}
        className={cx(
          "row-col",
          "flex-direction-column",
          "mb-4",
          "innerCol",
          {
            "show-on-desktop": templateCarouselMobile && idx !== 0,
            hasBackgroundColor: hasBackgroundColor,
          },
          `${templateClassName}Inner`,
        )}
      >
        {renderContentItemComponent(item, props)}
      </Col>
    );
  };

  const contentList =
    contents && contents.length
      ? contents.map((item, index) => {
          return renderEnvelope(item, index);
        })
      : null;

  return (
    <div
      className={cx("wrapper", "headingCardsCta", templateClassName)}
      style={cssv({
        backgroundColor: cssvBkgColor(backgroundColor || "transparent"),
      })}
      {...(anchor && {
        "data-anchor-id": anchor,
      })}
    >
      <Row>
        {textContent && (
          <HeadingContainer
            textContent={textContent}
            startH={startH}
            fnIdToNumber={fnIdToNumber}
            clientId={clientId}
            contentTextClassName={cx("contentText")}
            showAsCol={true}
            colProps={{
              md: 12,
              lg: 12,
              xl: 12,
              sm: 12,
            }}
            className={cx("headingContainer", {
              noHeadingContainer: !textContent,
              hasBodyContent: !!bodyContent,
            })}
          />
        )}
        <Col
          md={12}
          lg={12}
          xl={12}
          sm={12}
          className={cx({
            "show-on-desktop": templateCarouselMobile,
          })}
        >
          <Row
            data-client-id={clientId}
            className={cx(`${templateClassName}Main`)}
          >
            {contentList}
          </Row>
        </Col>
        {templateCarouselMobile && contents && (
          <Col
            md={12}
            lg={12}
            xl={12}
            sm={12}
            className={cx({
              "show-on-mobile": true,
            })}
          >
            <div className={cx("swiper", "swiperRoot")} id={`root_${clientId}`}>
              <div className="swiper-wrapper">{contentList}</div>
              <div data-swiper-button className={cx("swiper-buttons")}>
                <div
                  id={"button-prev-" + clientId}
                  className="swiper-button-prev"
                >
                  <CarouselPrevIcon className="headingCardsCtaSwiper-prev-lineargradient" />
                </div>
                <div
                  className={cx("swiperActiveIndex", "slideIndicatorNumber")}
                >
                  <span data-swiper-index={`${clientId}`}>1</span> /
                  <span>{contents.length}</span>
                </div>
                <div
                  id={"button-next-" + clientId}
                  className="swiper-button-next"
                >
                  <CarouselNextIcon className="headingCardsCtaSwiper-next-lineargradient" />
                </div>
              </div>
              {/* this can be moved as first child of the root div, so the intersection sensor catches it immediately */}
              {/* <span id={`${clientId}_swiperinit`}></span> */}
              <ClientComponentBridge
                {...props}
                clientComponentType="HeadingCardsCtaSwiper"
                itemExpandLogic="emptyitem"
              />
            </div>
          </Col>
        )}

        {buttons && (
          <Col
            md={12}
            lg={12}
            xl={12}
            sm={12}
            className={cx("ctaContainer", "headingCardsCtaContainer")}
          >
            <CTAList buttons={buttons} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HeadingCardsCta;

// helper functions

const renderFullWidthImage = (props: HeadingCardsCtaProps) => {
  const { item } = props;
  const { image = [] } = item.fields;
  const mobileImage = image[1] || image[0];
  return (
    <div className={cx("fullWidthImage")}>
      <div className={cx("show-on-desktop")}>
        {image[0] && (
          <ResponsiveImage
            image={image[0]}
            screenWidth="full"
            alt={image[0].fields.description || image[0].fields.title || ""}
          />
        )}
      </div>

      <div className={cx("show-on-mobile")}>
        {mobileImage && (
          <ResponsiveImage
            image={mobileImage}
            alt={
              mobileImage.fields.description || mobileImage.fields.title || ""
            }
          />
        )}
      </div>
    </div>
  );
};

const TemplateSettings: Record<string, TemplateSettingsProps> = {
  "one column": {
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 12 },
  },
  "two columns": {
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
  },
  "two columns with carousel": {
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    carouselMobile: true,
  },
  "two columns spacing": {
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    carouselMobile: true,
  },
  "two columns big cards": {
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
  },
  "three columns": {
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
    carouselMobile: true,
  },
  "three columns without carousel": {
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
  },
  "three columns spacing": {
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
    carouselMobile: true,
  },
  "three columns spacing without carousel": {
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
  },
  "four columns": {
    md: { span: 3 },
    lg: { span: 3 },
    xl: { span: 3 },
    carouselMobile: true,
  },
  "four columns without carousel": {
    md: { span: 3 },
    lg: { span: 3 },
    xl: { span: 3 },
  },
  "four columns spacing": {
    md: { span: 3 },
    lg: { span: 3 },
    xl: { span: 3 },
    carouselMobile: true,
  },
  "five columns": {
    md: { span: 2 },
    lg: { span: 2 },
    xl: { span: 2 },
    carouselMobile: true,
  },
  "five columns without carousel": {
    md: { span: 2 },
    lg: { span: 2 },
    xl: { span: 2 },
  },
};
