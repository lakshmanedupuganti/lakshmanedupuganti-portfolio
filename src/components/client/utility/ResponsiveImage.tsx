"use client"; // should be a client component as we're using next/image and passing the loader parameter which is a function

import {
  ImageLoaderProps,
  default as NextImage,
  ImageProps as NextImageProps,
} from "next/image";
import { DeviceSupportInfo } from "@lib/types";
import type { AssetEntry } from "@lakshmanedupuganti/server-library";

export interface ResponsiveImageProps extends Omit<NextImageProps, "src"> {
  mode?: "responsive" | "background";
  image?: AssetEntry;
  screenWidth?: "full" | "half" | "third";
  sizes?: string;
  loading?: NextImageProps["loading"];
  className?: string;
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  alt: string;
  supportInfo?: DeviceSupportInfo;
  dataAttributes?: { [key: string]: string };
  objectPosition?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  customImageSrc?: string;
  forceUnoptimized?: boolean;
}

export const _widthSizesMap: Record<
  NonNullable<ResponsiveImageProps["screenWidth"]>,
  string
> = {
  full: "100vw",
  half: "(max-width: 767px) 100vw, 50vw",
  third: "(max-width: 767px) 100vw, 33vw",
};

// for retina displays
export const _widthSizesIOSMap: Record<
  NonNullable<ResponsiveImageProps["screenWidth"]>,
  string
> = {
  full: "50vw",
  half: "(max-width: 383px) 50vw, 25vw",
  third: "(max-width: 383px) 50vw, 17vw",
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  mode = "responsive",
  image,
  screenWidth = "full",
  sizes,
  loading = "lazy",
  className,
  fill = false,
  alt = "Invisalign provider",
  priority = false,
  supportInfo = {},
  dataAttributes,
  objectPosition = "center bottom",
  objectFit,
  forceUnoptimized = false,
}) => {
  if (!image?.fields?.file?.url) return null;

  const { calculated } = image;

  const canUseWebp = !!(supportInfo.supportsWebp ?? calculated?.webp);
  const unoptimized = /\.svg$/i.test(image.fields.file.url) || forceUnoptimized;
  const calcSizes = sizes
    ? sizes
    : ((supportInfo.isIOS ?? calculated?.ios)
        ? _widthSizesIOSMap
        : _widthSizesMap)[screenWidth];

  const imageLoader = (props: ImageLoaderProps): string => {
    let { src, width } = props;
    if (src.startsWith("//")) {
      src = "https:" + src;
    }

    if (unoptimized) return src;

    const parms: string[] = [];
    const isWebpUrl = /\.webp$/.test(src);
    const isPngUrl = /\.png$/.test(src);
    if (canUseWebp) {
      if (!isWebpUrl) parms.push("fm=webp");
      else if (isPngUrl || isWebpUrl) {
        parms.push("fm=png");
      } else {
        parms.push("fm=jpg");
      }
    } else {
      if (isWebpUrl) parms.push("fm=png");
    }

    parms.push(`w=${width}`);
    return `${src}${src.indexOf("?") >= 0 ? "&" : "?"}${parms.join("&")}`;
  };

  return (
    <NextImage
      className={className}
      fill={fill}
      sizes={calcSizes}
      loading={loading}
      unoptimized={unoptimized}
      alt={image.fields.description || alt}
      priority={priority}
      {...(!fill && {
        width: image.fields.file.details.image?.width || 200,
        height: image.fields.file.details.image?.height || 200,
      })}
      src={`${image.fields.file.url.startsWith("//") ? "https:" : ""}${image.fields.file.url}`}
      {...(dataAttributes ? dataAttributes : {})}
      {...(mode === "background"
        ? {
            style: {
              objectFit: objectFit,
              objectPosition: objectPosition,
            },
          }
        : {})}
      loader={imageLoader}
    />
  );
};

export default ResponsiveImage;
