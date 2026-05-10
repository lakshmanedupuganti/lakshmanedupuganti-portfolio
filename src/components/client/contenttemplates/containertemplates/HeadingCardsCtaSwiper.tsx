"use client";

import { ContentFields, ClientContentItemComponentProps } from "@src/lib/types";
import { useEffect } from "react";
import styles from "./HeadingCardsCtaSwiper.dynamic.module.scss";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { useSwiper } from "@clientlib/hooks";

import "/node_modules/swiper/swiper.css";
import "/node_modules/swiper/modules/navigation.css";
import "/node_modules/swiper/modules/scrollbar.css";
import "/node_modules/swiper/modules/effect-fade.css";
import "/node_modules/swiper/modules/controller.css";

// the "styles" object for ....dynamic.module.scss will be empty but we need to reference it like this, so the css file gets generated and loaded during run time
void styles;

type DefaultItemProps = ClientContentItemComponentProps<ContentFields>;

const HeadingCardsCtaSwiper = (props: DefaultItemProps) => {
  const { item } = props;
  const clientId = item.calculated?.clientId;

  const { updateSlideIndex, initializeSlides, handleSlideResize } = useSwiper({
    clientId: clientId || "",
    modules: [Navigation, Pagination, Scrollbar],
    speed: 500,
    navigation: {
      nextEl: `#button-next-${clientId}`,
      prevEl: `#button-prev-${clientId}`,
    },
    updateOnWindowResize: true,
    onSlideChange: (swiper) => {
      updateSlideIndex(swiper.activeIndex);
    },
  });

  // Initialize slides
  useEffect(() => {
    if (!clientId) return;
    const slideInitId = `slideinit_${clientId}`;
    initializeSlides(slideInitId);
  }, [clientId, initializeSlides]);

  // Handle resize
  useEffect(() => {
    if (!clientId) return;
    const slideInitId = `slideinit_${clientId}`;
    const handleResize = () => handleSlideResize(slideInitId);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clientId, handleSlideResize]);

  return null;
};

export default HeadingCardsCtaSwiper;
