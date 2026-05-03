"use client";

import { useCallback, useEffect, useState } from "react";
import trackingUtility from "@clientlib/utility/tracking";
import domUtil from "@clientlib/utility/domUtility";
import { useDynamicComponent } from "@src/clientlib/hooks/intersection";
import LocalInputHandler from "./LocalInputHandler";
import dynamic from "next/dynamic";
import VideoPlayer from "@src/components/client/utility/VideoPlayer";

const ModalCloseIcon = dynamic(() =>
  import("@src/components/server/utility/IconSVGFile").then(
    (mod) => mod.ModalCloseIcon
  )
);

interface GlobalClickHandlerProps {}

const handleTrackingClick = (element: HTMLElement) => {
  let eventName = element?.getAttribute("data-telium-event");
  try {
    if (eventName) {
      trackingUtility.gtmTrackNA(eventName);
    }
    if (element?.tagName === "IMG" && element?.getAttribute("data-download")) {
      let store_data = element?.getAttribute("data-download");
      trackingUtility.gtmTrackNA("download_app", undefined, {
        app_type: store_data!,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const GlobalClickHandler: React.FC<GlobalClickHandlerProps> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<HTMLElement | null>(null);
  const [isSliderModal, setIsSliderModal] = useState<boolean>(false);
  const [videoLink, setVideoLink] = useState<string>("");
  const [customModal, setCustomModal] = useState<{
    size: "xl" | "sm" | "lg" | undefined;
    className: string;
  }>({
    size: "xl",
    className: "",
  });

  const ModalComp = useDynamicComponent(
    showModal,
    async () => (await import("@client/utility/dynamic/Modal")).default
  );

  const clickHandler = useCallback((event: MouseEvent) => {
    const { target } = event;
    if (!target) {
      return;
    }

    const el: HTMLElement = target as HTMLElement;
    handleTrackingClick(el);
    const attributeActions: { [key: string]: () => void } = {
      "data-header-banner": () => {
        if (el?.getAttribute("data-header-banner") === "hide-parent") {
          domUtil.handleHeaderBannerCloseClick(el);
        }
      },
      "data-topnav-menu-toggle": () => domUtil.handleTopNavToggleClick(el),
      "data-topnav-dropdown": () => domUtil.handleTopNavDropdownClick(el),
      "data-topnav-mega-menu": () => domUtil.handleTopNavMegaMenuClick(el),
      "data-nav-item": () => {
        domUtil.closeAllNavDropdowns();
      },
      "data-toggle": () => {
        if (el?.getAttribute("data-toggle") === "modal") {
          const videoLink = el?.getAttribute("data-video-link");
          if (videoLink) {
            setVideoLink(videoLink);
            setShowModal(true);
            return;
          }
          const target = el?.getAttribute("data-target");
          if (target) {
            const targetElement = document.querySelector(target);
            const modalData = targetElement?.children[0] as HTMLElement;
            if (modalData) {
              setModalData(modalData);
              setShowModal(true);
              setCustomModal({
                size:
                  (el?.getAttribute("data-toggle-size") as
                    | "xl"
                    | "sm"
                    | "lg"
                    | undefined) || "xl",
                className: el?.getAttribute("data-toggle-class") || "",
              });
            }
          }
        }
      },
      "data-tab-toggle": () => {
        if (el?.getAttribute("data-tab-toggle") === "modal") {
          const target = el?.getAttribute("data-tab-target-content");
          if (target) {
            domUtil.handleTabClick(el, true);
            const targetElement = document.querySelector(target);
            const modalData = targetElement?.children[0] as HTMLElement;
            if (!modalData) return;
            domUtil.handleModalTabClick(modalData, setModalData, setShowModal);
            setIsSliderModal(true);
          }
        }
      },
      "data-faq-accordion": () => {
        if (el?.getAttribute("data-faq-accordion") === "true") {
          domUtil.handleFaqAccordionClick(el);
        }
      },
      "data-accordion-item": () => domUtil.handleAccordionItemClick(el),
      "data-anchor-link": () => domUtil.handleAnchorLinkClick(el),
      "data-tab": () => domUtil.handleTabClick(el),
      "data-event-tab": () => domUtil.handleEventTabClick(el),
      "data-swiper-toggle-play": () => domUtil.handleSwiperTogglePlayClick(el),
      "data-tealium-event": () => domUtil.handleTealiumEventClick(el),
      "data-trustarc": () => {
        if (el?.getAttribute("data-trustarc") === "true") {
          domUtil.handleTrustArcClick(el);
        }
      },
      "data-calendly": () => {
        if (el?.getAttribute("data-calendly") === "true") {
          domUtil.handleCalendlyClick(el);
        }
      },
      "data-geo-acordion": () => {
        if (el?.getAttribute("data-geo-acordion") === "true") {
          domUtil.handleGeoAccordionClick(el);
        }
      },
    };

    for (const [attr, action] of Object.entries(attributeActions)) {
      domUtil.closeAllNavDropdowns(true);
      if (el.hasAttribute(attr)) {
        event.preventDefault();
        action();
        break;
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setModalData(null);
    setIsSliderModal(false);
    setVideoLink("");
  }, []);

  return (
    <>
      {ModalComp && videoLink && (
        <ModalComp
          show={showModal}
          size="xl"
          onHide={handleModalClose}
          centered
        >
          <VideoPlayer src={videoLink} />
        </ModalComp>
      )}

      {ModalComp && modalData && (
        <ModalComp
          show={showModal}
          size={customModal.size}
          onHide={handleModalClose}
          centered
          className={customModal.className}
        >
          <ModalComp.Header>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
              onClick={handleModalClose}
            >
              <ModalCloseIcon
                color="#000"
                onClick={handleModalClose}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </ModalComp.Header>
          {modalData && (
            <ModalComp.Body>
              {isSliderModal && <LocalInputHandler />}
              <div
                dangerouslySetInnerHTML={{
                  __html: modalData.outerHTML,
                }}
              />
            </ModalComp.Body>
          )}
        </ModalComp>
      )}
    </>
  );
};

export default GlobalClickHandler;
