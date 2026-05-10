// helper function

import type {
  ContentEntry,
  GeoData,
  NextPageResult,
} from "@aligntech-cw/contentful-server-lib2";
import type {
  AutosetValueFields,
  CustomFieldDef,
  FormFields,
  FormGroupFields,
  LeadResult,
  ShowFieldOn,
  SuccessTrackingConfig,
  TextContent,
} from "@src/lib/types";

import CookieUtil from "@clientlib/utility/cookie";
import util from "@clientlib/utility";
import domUtil from "@clientlib/utility/domUtility";
import { useEffect, useRef } from "react";
import { FormikHelpers, useFormikContext } from "formik";
import tracking from "@src/clientlib/utility/tracking";
import { sha256 } from "js-sha256";

export interface FormGroup {
  fields: CustomFieldDef[];
  textContent?: TextContent;
  showGroupOn?: ShowFieldOn[];
}
// get autovalue
export const getAutoValue = (
  autosetValue: AutosetValueFields,
  values: Record<string, any>,
  geoData?: GeoData,
): string | boolean | number => {
  const {
    sourceType,
    sourceKey = "",
    matchValue,
    valueIfMatch = "",
    valueIfNoMatch = "",
  } = autosetValue;
  if (!sourceType) return "";
  const resolvedValue = resolveSourceValue(
    sourceType,
    sourceKey,
    values,
    geoData,
  );

  let finalValue: string | boolean | number = resolvedValue;

  if (matchValue !== undefined && matchValue !== null) {
    finalValue = resolvedValue === matchValue ? valueIfMatch : valueIfNoMatch;
  }

  if (typeof finalValue === "string") {
    const trimmed = finalValue.trim().toLowerCase();

    // Convert boolean-like strings
    if (trimmed === "true") finalValue = true;
    if (trimmed === "false") finalValue = false;
  }
  return finalValue;
};

export const resolveSourceValue = (
  sourceType: "Cookie" | "URLSearchParams" | "Values" | "GeoData",
  key: string,
  values: Record<string, any>,
  geoData?: GeoData,
): string => {
  const sourceKeys = key.split("|").map((k) => k.trim());
  const { city, state, country, zip } = geoData || {};
  const geoDataKeys = Object.keys({ city, state, country, zip });
  switch (sourceType) {
    case "Cookie":
      return sourceKeys
        .map((k) => CookieUtil.getCookie(k) ?? "")
        .join(" ")
        .trim();

    case "URLSearchParams":
      if (typeof window === "undefined") return "";
      const params = new URLSearchParams(window.location.search);
      return sourceKeys
        .map((k) => params.get(k) ?? "")
        .join(" ")
        .trim();
    case "GeoData":
      return sourceKeys
        .map((k) =>
          geoDataKeys.includes(k) ? (geoData?.[k as keyof GeoData] ?? "") : "",
        )
        .join(" ")
        .trim();
    case "Values":
      const val = sourceKeys.map((k) => values?.[k] ?? "");
      return val.join(" ").trim();
    default:
      console.warn(`[getAutoValue] Unsupported source type: ${sourceType}`);
      return "";
  }
};

export const applyAutoSetValues = (
  fields: CustomFieldDef[],
  values: any,
  geoData?: GeoData,
) => {
  const newValues = { ...values };
  fields.forEach(({ otherSettings, fieldName = "" }) => {
    const { autosetValue, autoSetDefaultValues } = otherSettings || {};
    if (autosetValue && !autoSetDefaultValues) {
      try {
        newValues[fieldName] = getAutoValue(autosetValue, newValues, geoData);
      } catch (error) {
        console.error(`Failed to autoset for field: ${fieldName}`, error);
      }
    }
  });
  return newValues;
};

export const applyAutoSetValuesForDisabledFields = (
  fields: CustomFieldDef[],
  values: any,
  geoData?: GeoData,
) => {
  const newValues = { ...values };
  fields.forEach(({ otherSettings, fieldName = "" }) => {
    const { autosetValue, disabled } = otherSettings || {};
    // Only apply autoset values for disabled fields that have autosetValue configured
    if (autosetValue && disabled) {
      try {
        newValues[fieldName] = getAutoValue(autosetValue, newValues, geoData);
      } catch (error) {
        console.error(
          `Failed to autoset for disabled field: ${fieldName}`,
          error,
        );
      }
    }
  });
  return newValues;
};

export const mergeAdditionalComments = (
  values: any,
  originalValues: Record<string, any>,
) => {
  const newValues = { ...values };
  const additionalCommentKeys = Object.keys(originalValues).filter((key) =>
    key.startsWith("AddToAdditionalComments"),
  );

  const additionalComments = additionalCommentKeys
    .map((key) => originalValues[key])
    .filter((value) => value && value !== "NaN")
    .join(", ");

  if (additionalComments) {
    newValues.AdditionalComments = newValues.AdditionalComments
      ? `${newValues.AdditionalComments}, ${additionalComments}`
      : additionalComments;

    additionalCommentKeys.forEach((key) => {
      delete newValues[key];
    });
  }
  return newValues;
};

export const handleSuccessUI = (
  clientId: string,
  parentId: string = "",
  anchor: string = "",
) => {
  const containerSuccessMessageId = `formContainerSuccessMessage_${parentId}`;
  const formContainerId = `formContainerWrapper_${parentId}`;
  const formContainerWrapperId = `formContainer_${parentId}`;
  const successMessageId = `successMessage_${clientId}`;
  const formId = `form_${clientId}`;
  const formWrapperId = anchor || `formWrapper_${clientId}`;

  // Get elements with fallbacks
  const successMessageElement =
    document.getElementById(containerSuccessMessageId) ||
    document.getElementById(successMessageId);

  const formElement =
    document.getElementById(formContainerId) || document.getElementById(formId);

  // Hide form if it exists
  if (formElement) {
    formElement.style.display = "none";
  }

  // Show and scroll to success message
  if (successMessageElement) {
    // Scroll to appropriate wrapper
    const scrollTarget = formContainerWrapperId || formWrapperId;
    domUtil.scrollToAnchor(scrollTarget, false);

    // Remove root class if classList exists
    if (successMessageElement.classList) {
      util.removeClassByPattern(successMessageElement, /root/i);
    }
  } else {
    console.warn("Success message element not found");
  }
};

export const scrollToError = (clientId: string) => {
  const errorElement = document.querySelector(
    `[data-error-id="errorContainer-${clientId}"]`,
  );
  if (errorElement) {
    errorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

export const handleLeadFieldsWithErrors = (
  leadResult: LeadResult,
  formikHelpers: FormikHelpers<Record<string, any>>,
) => {
  const { errorDetails } = leadResult;

  if (!errorDetails) {
    console.warn("No errorDetails found in leadResult:", leadResult);
    return;
  }

  const message = errorDetails.message || errorDetails.errorCode || "Error";

  if (errorDetails.fieldsWithErrors?.length) {
    errorDetails.fieldsWithErrors.forEach((field: string) => {
      // Convert Salesforce field name to Formik-friendly (lowercase, trimmed)
      const formikField = field.trim().toLowerCase();
      formikHelpers.setFieldError(formikField, message);
    });
  } else {
    // If no specific fields, set a general form error
    formikHelpers.setStatus({ formError: message });
  }
};

interface FormObserverProps {
  onValuesChanged?: (
    prevValues: Record<string, any> | undefined,
    values: Record<string, any>,
  ) => void;
}

export const FormObserver: React.FC<FormObserverProps> = ({
  onValuesChanged,
}) => {
  const { values } = useFormikContext<Record<string, any>>();
  const prevValuesRef = useRef<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    if (
      prevValuesRef.current &&
      JSON.stringify(prevValuesRef.current) !== JSON.stringify(values)
    ) {
      onValuesChanged?.(prevValuesRef.current, values);
    }
    prevValuesRef.current = values;
  }, [values, onValuesChanged]);

  return null;
};

// Function to safely parse and retrieve default values
export const getDefaultValue = (value?: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(Number(value))) return Number(value);
  return value || "";
};

// Initialize form values
export const initializeFormValues = (
  fields: CustomFieldDef[],
  geoData?: GeoData,
): Record<string, any> =>
  fields.reduce((acc, { fieldName = "", defaultValue, otherSettings }) => {
    const { autoSetDefaultValues, autosetValue } = otherSettings || {};

    let initialValue = getDefaultValue(defaultValue);

    // If autoSetDefaultValues is true and autosetValue is configured, use auto-set value
    if (autoSetDefaultValues && autosetValue) {
      try {
        // For initialization, we provide empty values but pass geoData for GeoData source type
        const autoValue = getAutoValue(autosetValue, {}, geoData);
        if (autoValue) {
          initialValue = autoValue;
        }
      } catch (error) {
        console.error(
          `Failed to auto-set default value for field: ${fieldName}`,
          error,
        );
      }
    }

    return {
      ...acc,
      [fieldName]: initialValue,
    };
  }, {});

// Initialize touched state for form fields
export const initializeTouchedState = (
  fields: CustomFieldDef[],
): Record<string, boolean> =>
  fields.reduce(
    (acc, { fieldName = "" }) => ({ ...acc, [fieldName]: false }),
    {},
  );

export const renderFieldEnvelope = (
  item: ContentEntry<FormFields>,
): CustomFieldDef => {
  const { fields } = item;

  return {
    ...fields,
    validations: fields.fieldValidation?.validations ?? [],
    options: fields.fieldOptions?.options ?? [],
    otherFieldOptions: fields.fieldOptions ?? {},
    masking: fields.fieldMasking?.masking ?? {},
    otherSettings: fields.moreFields ?? undefined,
    label: fields.moreFields?.optionLabel || fields.label,
  };
};

export const renderFormGroup = (
  item: ContentEntry<FormGroupFields>,
): FormGroup => {
  const { fields } = item;
  const { formFields = [], moreFields, textContent } = fields;
  const showGroupOn = moreFields?.showFieldOn ?? [];

  const fieldsWithInheritedConditions = formFields.map((fieldItem) => {
    const fieldShowOn = fieldItem.fields.moreFields?.showFieldOn ?? [];
    const mergedShowOn = [...fieldShowOn, ...showGroupOn];

    return renderFieldEnvelope({
      ...fieldItem,
      fields: {
        ...fieldItem.fields,
        moreFields: {
          ...fieldItem.fields.moreFields,
          showFieldOn: mergedShowOn,
        },
      },
    } as ContentEntry<FormFields>);
  });

  return {
    fields: fieldsWithInheritedConditions,
    textContent,
    showGroupOn,
  };
};

export const filterVisibleFields = (
  fields: CustomFieldDef[],
  currentValues: Record<string, any>,
): CustomFieldDef[] => {
  return fields.filter((field: CustomFieldDef) => {
    const { otherSettings } = field || {};
    const { showFieldOn = [] } = otherSettings || {};

    if (!showFieldOn.length) return true;

    return showFieldOn.every(
      ({ fieldName: field = "", value, cookieName }: any) => {
        // Check if cookie condition exists and validate it
        if (cookieName) {
          const cookieExists = CookieUtil.getCookie(cookieName);
          return !!cookieExists; // Show if cookie is present
        }

        // Handle existing field-based conditions
        if (value && value.includes("/")) {
          return value
            .split("/")
            .map((v: string) => v.trim())
            .some((v: string) => currentValues[field] === v);
        }
        return currentValues[field] === value;
      },
    );
  });
};

export const removeNonPostableFields = (
  values: any,
  allFields: CustomFieldDef[],
) => {
  const newValues = { ...values };
  allFields.forEach(({ doNotPost, fieldName = "" }) => {
    if (fieldName && doNotPost) {
      delete newValues[fieldName];
    }
  });
  return newValues;
};

export const setCountryCode = (
  values: Record<string, any>,
  localeId: string = "",
  country: string = "",
) => {
  const newValues = { ...values };
  if (!newValues.countrycode && !newValues.CountryCode) {
    const localeCountry = localeId?.split("-")[1]?.toUpperCase();
    newValues.countrycode = country || localeCountry || "";
  }
  return newValues;
};

export const filterVisibleFormGroups = (
  formGroups: FormGroup[],
  currentValues: Record<string, any>,
): FormGroup[] => {
  return formGroups.filter((group) => {
    const { showGroupOn } = group as any;

    if (!showGroupOn || !showGroupOn.length) return true;

    return showGroupOn.every(
      ({ fieldName: field = "", value, cookieName }: any) => {
        // Check if cookie condition exists and validate it
        if (cookieName) {
          const cookieExists = CookieUtil.getCookie(cookieName);
          return !!cookieExists; // Show if cookie is present
        }

        // Handle existing field-based conditions
        if (value && value.includes("/")) {
          return value
            .split("/")
            .map((v: string) => v.trim())
            .some((v: string) => currentValues[field] === v);
        }
        return currentValues[field] === value;
      },
    );
  });
};

export const handleRedirectOnSuccess = (
  pageResult: NextPageResult,
  redirectSlugOnSuccess: string = "",
  successData: Record<string, any> = {},
): void => {
  if (!pageResult || !redirectSlugOnSuccess) return;

  try {
    const redirectSlug = util.addLocalePrefix(
      pageResult,
      redirectSlugOnSuccess,
    );
    const applyPlaceholders = (template: string): string =>
      template.replace(/\[([^\]]+)\]/g, (_, key) =>
        successData[key] != null
          ? encodeURIComponent(String(successData[key]))
          : "",
      );

    const cleanPath = (path: string): string =>
      path
        .replace(/([^:]\/)\/+/g, "$1") // remove duplicate slashes, but not after http(s):
        .replace(/\/$/, ""); // remove trailing slash

    const placeholderResolved = applyPlaceholders(redirectSlug);
    const sanitized = cleanPath(placeholderResolved);

    const urlObj = new URL(sanitized, window.location.origin);

    for (const [key, value] of Array.from(urlObj.searchParams.entries())) {
      if (!value) urlObj.searchParams.delete(key);
    }

    const finalUrl = urlObj.toString();

    window.location.href = finalUrl;
  } catch (error) {
    console.error("[Redirect Handler] Failed to process redirect:", error);
  }
};

export const trackEvents = (
  valuesToPost: Record<string, any>,
  leadService: "GLOBAL" | "EU" | "APAC" | "NPJ",
  formType: string,
) => {
  if (leadService === "NPJ") {
    if (formType === "ContactUs") {
      tracking.gtmTrack("contactsubmit", {
        country: valuesToPost.country,
      });
    }
    if (formType === "UniversityForm") {
      const utmCookieData = CookieUtil.getUTMCookie();
      const filteredUtmParams = utmCookieData
        ? Object.keys(utmCookieData).reduce((prev, current) => {
            const key = current as keyof typeof utmCookieData;
            const value = utmCookieData[key];
            return value && value.toLowerCase().includes("university")
              ? {
                  ...prev,
                  [current]: value,
                }
              : prev;
          }, {})
        : {};

      tracking.gtmTrack("university_contact_form", {
        event: "university_contact_form",
        country: valuesToPost.country,
        utmParams: JSON.stringify(filteredUtmParams),
      });
    }
  }
};

export const ErrorScrollHandler: React.FC = () => {
  const { errors, isSubmitting } = useFormikContext<Record<string, any>>();

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length > 0) {
      const errorField = Object.keys(errors)[0]; // Get first error field name
      const errorElement = document.querySelector(
        `[data-fieldname="${errorField}"]`,
      );

      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        (errorElement as HTMLElement).focus();
      }
    }
  }, [isSubmitting, errors]);

  return null;
};

export const fireTrackingEvent = (
  config: SuccessTrackingConfig,
  values: Record<string, any>,
) => {
  const {
    eventName,
    additionalData,
    fieldsToHash,
    fieldMappings = {},
  } = config;

  if (!eventName) return;

  const trackingData: Record<string, any> = {
    event: eventName,
    ...additionalData,
  };

  for (const [eventKey, formField] of Object.entries(fieldMappings)) {
    const rawValue = values?.[formField];

    if (!rawValue) continue;

    let value = rawValue;

    if (fieldsToHash?.includes(formField)) {
      value = sha256(value);
    }

    trackingData[eventKey] = value;
  }

  tracking.gtmTrack(eventName, trackingData);
};
