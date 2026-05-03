import {
  AssetEntry,
  ServerContentItemComponentProps,
} from "@lakshmanedupuganti/server-library";
import ResponsiveImage from "@src/components/client/utility/ResponsiveImage";
import { ContentFields, SliderProperties } from "@src/lib/types";
import BeforeAndAferSlider from "@server/utility/BeforeAfterSlider";
import Video from "@server/commontemplates/Video";

type RenderImageProps = {
  image: AssetEntry[];
  dataAttributes?: { [key: string]: string };
  mode?: "responsive" | "background";
  loading?: "eager" | "lazy";
};

const RenderImage = (props: RenderImageProps) => {
  const {
    image,
    dataAttributes,
    mode = "responsive",
    loading = "lazy",
  } = props;

  const mobileImage = image[1] || image[0];

  return (
    <>
      <div className={"show-on-desktop"} {...dataAttributes}>
        {image[0] && (
          <ResponsiveImage
            image={image[0]}
            alt={image[0].fields.description || image[0].fields.title || ""}
            dataAttributes={dataAttributes}
            mode={mode}
            loading={loading}
          />
        )}
      </div>

      <div className={"show-on-mobile"} {...dataAttributes}>
        {mobileImage && (
          <ResponsiveImage
            image={mobileImage}
            alt={
              mobileImage.fields.description || mobileImage.fields.title || ""
            }
            dataAttributes={dataAttributes}
            mode={mode}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default RenderImage;

type RenderAssetContainerProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      sliderImages?: boolean;
      sliderProperties?: SliderProperties;
      imageOrientation?: "left" | "right";
      mobileImagePosition?: "top" | "bottom";
    };
  }
> & {
  idType: "Mobile" | "Desktop";
};

export const RenderAssetContainerProps = (props: RenderAssetContainerProps) => {
  const { item, idType } = props;
  const { image = [], custom, video = [], videoUrl = [] } = item.fields;
  const { sliderImages, sliderProperties } = custom || {};
  const { clientId, firstDescendant } = item.calculated || {};
  const isMobile = idType === "Mobile";
  return (
    <>
      {(video && video.length) || (videoUrl && videoUrl.length) ? (
        <Video
          video={video[0]}
          src={videoUrl[0]}
          image={image[0]}
          playIconSize={isMobile ? "md" : "lg"}
          firstDescendant={firstDescendant}
        />
      ) : sliderImages ? (
        <BeforeAndAferSlider
          images={image}
          sliderProperties={sliderProperties || {}}
          clientId={idType + clientId || "NoClientId"}
          firstDescendant={firstDescendant}
        />
      ) : (
        <>
          <RenderImage
            image={image}
            loading={firstDescendant ? "eager" : "lazy"}
          />
        </>
      )}
    </>
  );
};
