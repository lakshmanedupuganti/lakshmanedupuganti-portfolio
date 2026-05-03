import type { AssetEntry } from "@lakshmanedupuganti/server-library";
import css from "./Video.module.scss";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import { PlayButton } from "@server/utility/IconSVGFile";
import Util from "@serverlib/utility";
interface VideoProps {
  video?: AssetEntry;
  image?: AssetEntry;
  src?: string;
  playIconSize?: "xs" | "sm" | "md" | "lg" | "xl";
  clientId?: string;
  firstDescendant?: boolean;
}

const Video = ({
  video,
  image,
  src,
  playIconSize = "md",
  clientId,
  firstDescendant,
}: VideoProps) => {
  if (!video && !src) {
    return null;
  }

  const contentType = video ? "video" : "videoUrl";

  let videoUrl = src || "";

  if (video && video.fields.file) {
    videoUrl = video.fields.file.url;
  }

  return (
    <div className={css.videoWrapper}>
      {image ? (
        <div className={css.videoPlayerImage}>
          <ResponsiveImage
            mode="background"
            image={image}
            alt={image.fields.description || "video image"}
            loading={firstDescendant ? "eager" : "lazy"}
          />
        </div>
      ) : (
        <div className={css.imagePlaceholder}></div>
      )}
      <div
        className={`${css.playButton} ${css[playIconSize]}`}
        data-toggle="modal"
        data-video-link={videoUrl}
        {...Util.renderContentfulDataAttributes(clientId || "", contentType)}
      >
        <PlayButton data-toggle="modal" data-video-link={videoUrl} />
      </div>
    </div>
  );
};

export default Video;
