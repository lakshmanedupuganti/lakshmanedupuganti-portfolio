"use client";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import type { ContentfulEntry } from "@lakshmanedupuganti/server-library";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import crypto from "crypto";

export interface ContentfulPreviewProps {
  locale: string;
  cacheKey?: string;
  entryid: string;
  //entry: EntryEx;
}

const PreviewInner: React.FC<ContentfulPreviewProps> = (props) => {
  //const { entry } = props;

  // this will not work with EntryEx (sys.id is probably expected)
  //const ret = useContentfulLiveUpdates(entry);
  //console.log("ret", ret);

  return <></>;
};

const makeid = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  const randomBytes = crypto.randomBytes(length); // Generate secure random bytes

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charactersLength; // Map byte to a character index
    result += characters.charAt(randomIndex); // Add the corresponding character to the result
  }
  return result;
};

interface ContentfulMessage {
  action: string;
  contentType?: { sys: { id: string } };
  entity?: ContentfulEntry;
  method: string;
  source: string;
  // entityReferenceMap -> TODO check this for newly added references
}

let lastScrollPos = 0;

const ContentfulPreview: React.FC<ContentfulPreviewProps> = (props) => {
  const { locale, cacheKey, entryid: enttryid } = props;
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (lastScrollPos) {
      window.scrollTo(0, lastScrollPos);
    }
  }, [pathName]);

  // hook our own message listener, as the useContentfulLiveUpdates hook won't work with our custom EntryEx
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      console.log("handler hit: " + cacheKey);
      if (!cacheKey) return;

      const data = event.data as ContentfulMessage;
      if (data.action === "ENTRY_UPDATED" && data.entity) {
        console.log("data: ", data);

        try {
          const ret = (
            await axios.post("/api/preview", {
              cacheKey,
              entry: data.entity,
            })
          ).data;

          const url = `/preview/${locale}/${enttryid}/${makeid(
            8,
          )}?k=${cacheKey}`;

          lastScrollPos = window.scrollY;

          // for some reason the non-scrolling is not working, probably because we don't have a normal layout component
          // using some ugly workarounds to return to the previous scroll position
          router.push(url, { scroll: false });
        } catch (e) {
          console.log(e);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  });

  // ContentfulLivePreviewProvider needed so the iframe messaging is established

  return (
    <ContentfulLivePreviewProvider
      locale={locale} // Required: allows you to set the locale once and have it reused throughout the preview.
      enableInspectorMode={true} // Optional: allows you to toggle inspector mode which is on by default.
      enableLiveUpdates={true} // Optional: allows you to toggle live updates which are on by default.
      targetOrigin="https://app.contentful.com" // Optional: allows you to configure the allowed host(s) of live preview (default: ['https://app.contentful.com', 'https://app.eu.contentful.com'])
      debugMode={true} // Optional: allows you to toggle debug mode which is off by default.
    ></ContentfulLivePreviewProvider>
  );
};

export default ContentfulPreview;
