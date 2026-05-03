"use client";

import Script from "next/script";
import { createRoot } from "react-dom/client";

class DynamicUtility {
  public loadClientScript(src: string, timeout = 10000) {
    return new Promise<void>((resolve, reject) => {
      let resolved = false;

      const resv = (error: string) => {
        if (!resolved) {
          resolved = true;
          if (error) reject(new Error(error));
          else resolve();
        }
      };

      window.setTimeout(() => resv("timeout"), timeout);

      const div = document.createElement("div");
      const root = createRoot(div);
      root.render(
        <Script
          onLoad={() => {
            resv("");
          }}
          onError={(e) => {
            resv("error loading script");
          }}
          src={src}
        />,
      );
    });
  }
}

const inst = new DynamicUtility();
export default inst;
