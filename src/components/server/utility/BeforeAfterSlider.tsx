import { SliderProperties } from "@src/lib/types";
import css from "./BeforeAfterSlider.module.scss";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import { csx } from "@src/lib/utility/stylings/classes";
import { SliderArrowLeft, SliderArrowRight } from "@server/utility/IconSVGFile";
import type { AssetEntry } from "@aligntech-cw/contentful-server-lib2";

interface BeforeAfterSliderProps {
  images: AssetEntry[];
  clientId: string;
  sliderProperties: SliderProperties;
  firstDescendant?: boolean;
}

const BeforeAfterSlider = ({
  images,
  sliderProperties,
  clientId,
  firstDescendant
}: BeforeAfterSliderProps) => {
  if (!images || images.length < 2) {
    return null;
  }

  const [beforeImage, afterImage] = images;
  const { sliderBtnText = "Slide", beforeText, afterText } = sliderProperties;

  return (
    <div id={"sliderWrapper_" + clientId} className={css.wrapper}>
      <div className={css.imageContainer}>
        <ResponsiveImage
          image={beforeImage}
          alt={beforeImage.fields.description || "before image"}
          className={csx(css, "beforeImage", "sliderImage")}
          loading={firstDescendant ? "eager" : "lazy"}
        />
        <ResponsiveImage
          image={afterImage}
          alt={afterImage.fields.description || "after image"}
          className={csx(css, "afterImage", "sliderImage")}
          loading={firstDescendant ? "eager" : "lazy"}
        />

        {beforeText && afterText && (
          <div className={css.beforeAfterText}>
            <span>{beforeText}</span>
            <span>{afterText}</span>
          </div>
        )}
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          aria-label="Percentage of before photo shown"
          className={css.slider}
          data-slider={true}
          data-slider-target={"#sliderWrapper_" + clientId}
        />
        <div className={css.sliderLine} aria-hidden="true" />
        <div className={csx(css, "sliderButton")} aria-hidden="true">
          <span
            className={csx(css, "buttonText")}
            aria-label="Before and after slider button"
            aria-hidden="true"
          >
            <span>
              <SliderArrowLeft />
            </span>
            <span className={css.buttonText}>{sliderBtnText}</span>
            <span>
              <SliderArrowRight />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
