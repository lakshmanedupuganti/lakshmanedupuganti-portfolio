import {
  ClientContentItemComponentProps,
  ContentFields,
  FormItemFields,
} from "@src/lib/types";
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import CookieUtil from "@clientlib/utility/cookie";
import domUtil from "@clientlib/utility/domUtility";
import css from "./FormComponent.dynamic.module.scss";
import { csx, _cx } from "@src/lib/utility/stylings/classes";
import buttonCSS from "@src/components/server/contenttemplates/commontemplates/Button.module.scss";

type CalendlyFormWidgetProps = ClientContentItemComponentProps<
  ContentFields & FormItemFields
> & {
  calendlyBtnDisabled?: boolean;
};
const btncx = _cx(buttonCSS);

const buildCalendlyPrefill = (
  leadData: Record<string, any>,
  calendlyFields: Record<string, string> = {},
  calendlyCustomFields: Record<string, string> = {},
) => {
  const prefill: Record<string, any> = {};
  const customAnswers: Record<string, any> = {};

  // 🔹 Handle standard fields (email, name, etc.)
  Object.entries(calendlyFields).forEach(([prefillKey, template]) => {
    if (!template) return;

    // Replace {placeholders} with actual values
    const value = template
      .replace(/\{(.*?)\}/g, (_, key) => {
        return leadData[key] ?? "";
      })
      .trim();

    if (value) {
      prefill[prefillKey] = value;
    }
  });

  // 🔹 Handle custom fields
  Object.entries(calendlyCustomFields).forEach(([leadKey, calendlyKey]) => {
    const value = leadData[leadKey];
    if (value !== undefined && value !== null && value !== "") {
      customAnswers[calendlyKey] = value;
    }
  });

  if (Object.keys(customAnswers).length > 0) {
    prefill.customAnswers = customAnswers;
  }

  return prefill;
};

const CalendlyFormWidget = (props: CalendlyFormWidgetProps) => {
  const { item, calendlyBtnDisabled = false } = props;
  const { calendly } = item.fields.custom || {};
  const {
    calendlyUrl,
    calendlyType = "Inline embed",
    calendlyBtnLabel = "Book a call",
    calendlyFields,
    calendlyCustomFields,
  } = calendly || {};
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  const getLeadData = useCallback(() => {
    try {
      const raw = CookieUtil.getCookie("_leadData");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const prefill = useMemo(() => {
    return buildCalendlyPrefill(
      getLeadData(),
      calendlyFields,
      calendlyCustomFields,
    );
  }, [getLeadData, calendlyFields, calendlyCustomFields]);

  useEffect(() => {
    const handler = () => setIsVisible(true);
    window.addEventListener("form:submitted", handler);
    return () => window.removeEventListener("form:submitted", handler);
  }, []);

  // init inline widget
  useEffect(() => {
    if (!isVisible || calendlyType !== "Inline embed" || !calendlyUrl) return;
    if (initializedRef.current) return;
    const init = () => {
      const el = containerRef.current;
      if (!el) return;

      // make sure Calendly is ready
      if (!window.Calendly?.initInlineWidget) return;
      const container = document.getElementById("calendly-inline-widget");
      if (!container) return;
      initializedRef.current = true;

      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        prefill,
        parentElement: container,
      });
    };

    domUtil.loadCalendlyAssets(() => {
      // defer to next frame to ensure DOM is committed
      requestAnimationFrame(init);
    });
  }, [isVisible, calendlyType, calendlyUrl, prefill]);

  if (!calendlyUrl) return null;
  if (!isVisible) return null;

  return (
    <>
      {calendlyType === "Inline embed" && (
        <div
          ref={containerRef}
          className={csx(css, "styledCalendly", "calendly-inline-widget")}
          data-auto-load="false"
          id="calendly-inline-widget"
        />
      )}

      {calendlyType !== "Inline embed" && (
        <div className="w-100 mx-auto d-flex justify-content-center customButton">
          <button
            className={btncx("btn styledButton buttonText primary")}
            style={
              {
                "--btnHeight": "var(--btnHeight-md)",
                "--btnPadding": "var(--btnPadding-md)",
                "--btnFontSize": "var(--btnFontSize-md)",
                "--btnColor": "var(--btnColor-heritage-blue)",
                "--btnHoverColor": "var(--btnHoverColor-heritage-blue)",
                width: "initial",
              } as React.CSSProperties
            }
            onClick={() => {
              if (window.Calendly?.initPopupWidget) {
                window.Calendly.initPopupWidget({
                  url: calendlyUrl,
                  prefill,
                });
              } else {
                window.open(calendlyUrl, "_blank");
              }
            }}
            disabled={calendlyBtnDisabled}
          >
            <span className="buttonText">{calendlyBtnLabel}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default CalendlyFormWidget;
