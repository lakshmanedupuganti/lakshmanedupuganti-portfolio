"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Formik, Form } from "formik";
import { Row, Col } from "react-bootstrap";

import Input from "./inputs";
import { getValidationSchema } from "./validationSchema";
import CookieUtil from "@clientlib/utility/cookie";
import buttonCSS from "/src/components/server/contenttemplates/commontemplates/Button.module.scss";
import css from "./FormComponent.dynamic.module.scss";

import { _cx, csx } from "@src/lib/utility/stylings/classes";
import type {
  ContentEntry,
  NextPageResult,
} from "@aligntech-cw/contentful-server-lib2";
import { submitLead } from "@client/contenttemplates/forms/SubmitLead";
import { renderContentToHtml } from "../commontemplates/ContentText";
import FormDevPanel from "../NPJForm/Developmentpanel/FormDevPanel";

import type {
  ClientContentItemComponentProps,
  ContentFields,
  CustomFieldDef,
  FormFields,
  FormGroupFields,
  FormItemFields,
  LeadResult,
  SuccessTrackingConfig,
} from "@src/lib/types";
import {
  applyAutoSetValues,
  applyAutoSetValuesForDisabledFields,
  filterVisibleFields,
  filterVisibleFormGroups,
  FormObserver,
  handleSuccessUI,
  initializeFormValues,
  initializeTouchedState,
  mergeAdditionalComments,
  removeNonPostableFields,
  renderFieldEnvelope,
  renderFormGroup,
  setCountryCode,
  FormGroup,
  handleRedirectOnSuccess,
  scrollToError,
  handleLeadFieldsWithErrors,
  trackEvents,
  ErrorScrollHandler,
  fireTrackingEvent,
} from "./helperFunction";

const cx = _cx(css);
const btncx = _cx(buttonCSS);

type FormComponentProps = ClientContentItemComponentProps<
  ContentFields & FormItemFields
> & {
  customSubmit?: (submitValues: Record<string, any>) => Promise<{
    success: boolean;
    message?: string;
  }>;
  hideSubmitButton?: boolean;
  onFormValuesChanged?: (values: Record<string, any>) => void;
  formValues?: Record<string, any>;
};

interface ColChildProps {
  fieldName: string;
  type?: string;
  col?: number;
}

interface ColsProps {
  num?: number;
  children?: React.ReactElement<ColChildProps>[];
}

export const Cols: React.FC<ColsProps> = ({ children = [] }) => (
  <Row className="mb-4">
    {children.map((child, index) => {
      const props = child.props as ColChildProps;
      return (
        <Col
          key={`${props.fieldName}-${index}-${props.type || ""}`}
          lg={props.col || 12}
          className={props.type !== "hidden" ? "mb-1" : ""}
          data-fieldname={props.fieldName}
        >
          {child}
        </Col>
      );
    })}
  </Row>
);

const FormComponent: React.FC<FormComponentProps> = (props) => {
  const {
    item,
    pageResult = {} as NextPageResult,
    env,
    customSubmit,
    onFormValuesChanged,
    hideSubmitButton,
    formValues,
  } = props;
  const { localeId, geoData, slug = "" } = pageResult || {};
  const {
    CLIENT_API_PREFIX = "",
    RECAPTCHA_ACTIVE = "",
    USE_DEVELOPMENT_PANEL = false,
  } = env || {};
  const { country = "" } = geoData || {};

  const {
    custom,
    leadService = "GLOBAL",
    formFields = [],
    leadSource,
    subLeadSource,
    anchor,
    errorMessage,
  } = item.fields || {};
  const {
    languageData,
    leadOwnerId = "",
    recordtypeid,
    campaignId,
    formType,
    redirectSlugOnSuccess,
    hideDevPanel = false,
    displayFieldErrors = false,
    successTrackingConfig = {} as SuccessTrackingConfig,
  } = custom || {};
  const { clientId, parentId } = item.calculated || {};
  const { headline: errorHeadline, bodyContent: errorBodyContent } =
    errorMessage || {};
  const { allFields, formGroups } = useMemo(() => {
    if (!formFields.length) return { allFields: [], formGroups: [] };

    const all: CustomFieldDef[] = [];
    const groups: FormGroup[] = [];

    formFields.forEach((entry) => {
      if (entry.contentType === "formGroup") {
        const group = renderFormGroup(entry as ContentEntry<FormGroupFields>);
        groups.push(group);
        all.push(...group.fields);
      } else {
        all.push(renderFieldEnvelope(entry as ContentEntry<FormFields>));
      }
    });

    return { allFields: all, formGroups: groups };
  }, [formFields]);

  const res = (s: string) => (languageData ?? {})[s] || s;
  const initialValues = useMemo(
    () => initializeFormValues(allFields, geoData),
    [allFields, geoData],
  );
  const initialTouched = useMemo(
    () => initializeTouchedState(allFields),
    [allFields],
  );

  // Compute initial currentValues by merging initialValues and formValues
  const initialCurrentValues = useMemo(() => {
    return formValues && Object.keys(formValues).length > 0
      ? { ...initialValues, ...formValues }
      : initialValues;
  }, [initialValues, formValues]);

  const [currentValues, setCurrentValues] =
    useState<Record<string, any>>(initialCurrentValues);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevFormValuesRef = useRef<Record<string, any> | undefined>(formValues);
  const prevInitialValuesRef = useRef<Record<string, any>>(initialValues);

  useEffect(() => {
    // Only update if formValues or initialValues actually changed
    const formValuesChanged =
      JSON.stringify(prevFormValuesRef.current) !== JSON.stringify(formValues);
    const initialValuesChanged =
      JSON.stringify(prevInitialValuesRef.current) !==
      JSON.stringify(initialValues);

    if (formValuesChanged || initialValuesChanged) {
      const newValues =
        formValues && Object.keys(formValues).length > 0
          ? { ...initialValues, ...formValues }
          : initialValues;

      setCurrentValues(newValues);
      prevFormValuesRef.current = formValues;
      prevInitialValuesRef.current = initialValues;
    }
  }, [formValues, initialValues]);

  // Handle form value changes with FormObserver
  const handleValuesChanged = useCallback(
    (
      prevValues: Record<string, any> | undefined,
      values: Record<string, any>,
      setValues?: (values: Record<string, any>) => void,
    ) => {
      setIsError(false);

      // Apply autoset values for disabled fields on change
      if (setValues) {
        const autoSetValues = applyAutoSetValuesForDisabledFields(
          allFields,
          values,
          geoData,
        );
        const hasChanges = Object.keys(autoSetValues).some(
          (key) => autoSetValues[key] !== values[key],
        );

        if (hasChanges) {
          setValues(autoSetValues);
          setCurrentValues(autoSetValues);
          onFormValuesChanged?.(autoSetValues);
          return;
        }
      }

      setCurrentValues(values);
      onFormValuesChanged?.(values);
    },
    [allFields, geoData, onFormValuesChanged],
  );

  // Memoize visible fields to prevent unnecessary re-renders
  const visibleFields = useMemo(
    () => filterVisibleFields(allFields, currentValues),
    [allFields, currentValues],
  );

  // Memoize visible form groups to prevent unnecessary re-renders
  const visibleFormGroups = useMemo(
    () => filterVisibleFormGroups(formGroups, currentValues),
    [formGroups, currentValues],
  );

  const validationSchema = useMemo(
    () => getValidationSchema(visibleFields, res, currentValues),
    [visibleFields, res, currentValues],
  );

  const renderFields = useCallback(
    (
      fields: CustomFieldDef[],
      currentValues: Record<string, any>,
      res: (s: string) => string,
    ) => {
      const visibleFields = filterVisibleFields(fields, currentValues);

      return visibleFields
        .filter((f) => f.type !== "hidden")
        .map((f, index) => {
          const {
            countryLocalizedLabels = {},
            showFieldOn = [],
            disabled = false,
          } = f.otherSettings || {};
          const countryCode =
            currentValues.CountryCode ||
            currentValues.countrycode ||
            currentValues.country ||
            "";
          const translatedLabel =
            countryLocalizedLabels[countryCode] || f.label;
          const visibilityKey =
            showFieldOn
              ?.map((condition) => `${condition.fieldName}-${condition.value}`)
              .join("-") || "always-visible";

          return (
            <Input
              {...f}
              key={`${f.fieldName}-${f.type}-${index}-${visibilityKey}`}
              label={`${translatedLabel}${
                f.validations?.some((v) => v?.type === "required") ? " *" : ""
              }`}
              placeholder={f.type === "select" ? res("select") : ""}
              fieldDisabled={disabled || false}
              displayFieldErrors={displayFieldErrors}
            />
          );
        });
    },
    [],
  );

  const handleSubmit = async (
    values: Record<string, any>,
    formikHelpers: any,
  ) => {
    setIsSubmitting(true);
    setIsError(false);

    let valuesToPost = { ...values };

    const autoSetValues = applyAutoSetValues(allFields, valuesToPost, geoData);
    valuesToPost = { ...valuesToPost, ...autoSetValues };
    // Country Code
    const countryCodeValue = setCountryCode(valuesToPost, localeId, country);
    valuesToPost = { ...valuesToPost, ...countryCodeValue };
    // Lead metadata
    valuesToPost = CookieUtil.addUTMParams(valuesToPost) as any;
    valuesToPost.LeadSource = leadSource || "";
    valuesToPost.SubLeadSource = subLeadSource || "";
    valuesToPost.LeadService = leadService;

    if (leadOwnerId && !valuesToPost.ownerid)
      valuesToPost.ownerid = leadOwnerId;
    if (recordtypeid && !valuesToPost.recordtypeid)
      valuesToPost.recordtypeid = recordtypeid;
    if (campaignId && !valuesToPost.campaignId)
      valuesToPost.campaignId = campaignId;

    const mergedComments = mergeAdditionalComments(valuesToPost, values);
    valuesToPost = { ...valuesToPost, ...mergedComments };

    const cleanedValues = removeNonPostableFields(valuesToPost, allFields);
    valuesToPost = cleanedValues;
    valuesToPost.formType = formType;

    console.log("submitting values:", valuesToPost);
    trackEvents(valuesToPost, leadService, formType || "");

    if (leadService === "NPJ") {
      valuesToPost.utmParams = CookieUtil.getUTMCookie() || {};
    }

    try {
      const result = customSubmit
        ? await customSubmit(valuesToPost)
        : await submitLead(
            valuesToPost,
            leadService,
            CLIENT_API_PREFIX,
            RECAPTCHA_ACTIVE === "true",
            slug,
          );

      if (result?.success) {
        const stringValues = JSON.stringify(valuesToPost);
        CookieUtil.putCookie("_leadData", stringValues);
        window.dispatchEvent(new Event("form:submitted"));
        fireTrackingEvent(successTrackingConfig, valuesToPost);
        if (redirectSlugOnSuccess) {
          handleRedirectOnSuccess(pageResult, redirectSlugOnSuccess, {
            ...result,
            ...valuesToPost,
          });
          return;
        }
        if (clientId) {
          handleSuccessUI(clientId, parentId, anchor);
        }
      } else {
        setIsError(true);
        handleLeadFieldsWithErrors(result as LeadResult, formikHelpers);
        handleLeadFieldsWithErrors(result as LeadResult, formikHelpers);
        if (clientId) {
          scrollToError(clientId);
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isError && clientId) {
      scrollToError(clientId);
    }
  }, [isError, clientId]);

  // Track formValues updates to sync with Formik
  const formValuesRef = useRef<Record<string, any> | undefined>(formValues);
  const formikSetValuesRef = useRef<
    ((values: Record<string, any>) => void) | null
  >(null);

  useEffect(() => {
    // Only update if formValues actually changed
    if (
      formValues &&
      JSON.stringify(formValuesRef.current) !== JSON.stringify(formValues)
    ) {
      formValuesRef.current = formValues;
      // Update Formik values when formValues prop changes (currentValues is already updated by the other useEffect)
      if (formikSetValuesRef.current) {
        formikSetValuesRef.current((prev: Record<string, any>) => ({
          ...prev,
          ...formValues,
        }));
      }
    }
  }, [formValues]);

  return (
    <div
      className={cx("formComponentContainer", {
        singleFieldView:
          visibleFields.filter((f) => f.type !== "hidden").length === 1,
        errorView: isError,
      })}
    >
      <Formik
        initialValues={{ ...currentValues }}
        initialTouched={initialTouched}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setValues, errors }) => {
          // Store setValues reference for use in useEffect
          formikSetValuesRef.current = setValues;

          if (USE_DEVELOPMENT_PANEL) {
            console.log("formik errors", errors);
          }

          return (
            <>
              {(leadService === "NPJ" ||
                (formType === "Become a Provider" && leadService === "EU")) &&
                USE_DEVELOPMENT_PANEL &&
                !hideDevPanel && (
                  <FormDevPanel
                    setValues={(values: Record<string, any>) => {
                      setValues(values);
                    }}
                    resetValues={() => setValues(initialValues)}
                    enableDevelopmentPanel={USE_DEVELOPMENT_PANEL}
                    formType={formType}
                    fields={allFields}
                  />
                )}
              <Form>
                {isError && (
                  <Col
                    md={12}
                    lg={12}
                    xl={12}
                    sm={12}
                    className={csx(css, "errorContainer", {
                      noHeadingContainer: !errorMessage,
                    })}
                    data-error-id={`errorContainer-${clientId}`}
                  >
                    <div className={cx("errorContent")}>
                      {errorHeadline ? (
                        <h2
                          className={csx(css, "displayTitle5", "errorHeadline")}
                          dangerouslySetInnerHTML={{
                            __html: renderContentToHtml(errorHeadline),
                          }}
                        />
                      ) : (
                        <h2
                          className={csx(css, "displayTitle5", "errorHeadline")}
                        >
                          Something went wrong
                        </h2>
                      )}

                      {errorBodyContent && (
                        <div>
                          <div
                            className={csx(css, "bodyText", "errorBodyContent")}
                            dangerouslySetInnerHTML={{
                              __html:
                                renderContentToHtml(errorBodyContent) ||
                                "Please try again later.",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                )}
                <ErrorScrollHandler />
                <FormObserver
                  onValuesChanged={(prevValues, newValues) =>
                    handleValuesChanged(prevValues, newValues, setValues)
                  }
                />
                {visibleFormGroups.length > 0 ? (
                  visibleFormGroups.map(
                    (group: FormGroup, groupIndex: number) => {
                      const { textContent, fields } = group || {};
                      const { headline, bodyContent } = textContent || {};

                      const groupVisibleFields = filterVisibleFields(
                        fields,
                        currentValues,
                      );

                      return (
                        <div
                          key={groupIndex}
                          className={cx("formGroupSection", "mb-4")}
                        >
                          <Col
                            md={12}
                            lg={12}
                            xl={12}
                            sm={12}
                            className={csx(
                              css,
                              "formComponentHeadingContainer",
                              {
                                noHeadingContainer: !textContent,
                              },
                            )}
                          >
                            <div className={cx("formComponentTextContainer")}>
                              {headline && (
                                <h2
                                  className={"displayTitle2"}
                                  dangerouslySetInnerHTML={{
                                    __html: renderContentToHtml(headline),
                                  }}
                                />
                              )}

                              {bodyContent && (
                                <div>
                                  <div
                                    className={"bodyText"}
                                    dangerouslySetInnerHTML={{
                                      __html: renderContentToHtml(bodyContent),
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </Col>

                          <Cols>
                            {renderFields(
                              groupVisibleFields,
                              currentValues,
                              res,
                            )}
                          </Cols>
                        </div>
                      );
                    },
                  )
                ) : (
                  <Cols>{renderFields(visibleFields, currentValues, res)}</Cols>
                )}
                {!hideSubmitButton && (
                  <div
                    className={
                      "w-100 mx-auto d-flex justify-content-center customButton"
                    }
                  >
                    <button
                      className={btncx("btn styledButton buttonText primary")}
                      type="submit"
                      data-tracking-key="home-hero-cta-become-a-provider"
                      style={
                        {
                          "--btnHeight": "var(--btnHeight-md)",
                          "--btnPadding": "var(--btnPadding-md)",
                          "--btnFontSize": "var(--btnFontSize-md)",
                          "--btnColor": "var(--btnColor-heritage-blue)",
                          "--btnHoverColor":
                            "var(--btnHoverColor-heritage-blue)",
                          width: "initial",
                        } as React.CSSProperties
                      }
                      disabled={isSubmitting}
                    >
                      <span className="buttonText">{res("Submit")}</span>
                    </button>
                  </div>
                )}
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormComponent;
