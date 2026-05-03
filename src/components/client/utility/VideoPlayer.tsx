"use client";

import { csx } from "@src/lib/utility/stylings/classes";
import css from "./VideoPlayer.module.scss";
import videoUtility from "@src/clientlib/utility/video";

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const { url: videoUrl, type } = videoUtility.getHostedVideoUrl(src) || {};

  if (!videoUrl) {
    return null;
  }

  const handleVideoStart = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "video_start",
        video_title: src.split("/").pop(), // Extract filename from URL
        video_url: videoUrl,
      });
    }
  };

  return (
    <div className={css.videoPlayer}>
      {type === "CMS" ? (
        <video
          controls
          autoPlay
          controlsList="nodownload"
          playsInline
          onPlay={handleVideoStart}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <iframe
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          src={videoUrl}
          data-aspect-ratio="0.7"
          allowFullScreen
          className={csx(css, type)}
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;
