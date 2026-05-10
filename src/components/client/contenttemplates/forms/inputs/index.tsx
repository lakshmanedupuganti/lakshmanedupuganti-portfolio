"use client";

import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./Select";
import CheckBox from "./CheckBox";
import Hidden from "./Hidden";
import CheckBoxGroup from "./CheckBoxGroup";
import RadioBoxGroup from "./RadioBoxGroup";
import DateInput from "./DateInput";
import { useFormikContext } from "formik";
import { CustomFieldDef } from "@lib/types";
import css from "./index.module.scss";
import { useEffect, useState } from "react";
import Tooltip from "@src/components/client/utility/dynamic/Tooltip";
import clientUtil from "@clientlib/utility/cookie";
import { csx } from "@src/lib/utility/stylings/classes";

const Component: React.FC<CustomFieldDef & { displayFieldErrors?: boolean }> = (
  props
) => {
  const {
    fieldName = "",
    type: initialType,
    otherSettings,
    fieldDisabled = false,
    displayFieldErrors = false,
  } = props;
  const { showFieldOn = [], tooltip } = otherSettings || {};
  const { errors, touched, values, setFieldValue } =
    useFormikContext<Record<string, any>>();
  const [type, setType] = useState(props.type || "text");

  useEffect(() => {
    if (!showFieldOn.length) return;

    const shouldHide = showFieldOn.every(
      ({ fieldName: field = "", value, cookieName }) => {
        // Check if cookie condition exists and validate it
        if (cookieName) {
          const cookieExists = clientUtil.getCookie(cookieName);
          return !cookieExists; // Hide if cookie is missing
        }

        // Handle existing field-based conditions
        if (value && value.includes("/")) {
          return value
            .split("/")
            .map((v) => v.trim())
            .every((v) => values[field] !== v);
        }
        return values[field] !== value;
      }
    );

    const fieldElement = document.querySelector(
      `[data-fieldname="${fieldName}"]`
    ) as HTMLElement;

    if (fieldElement) {
      if (shouldHide) {
        fieldElement.classList.add("hidden-field");
        setTimeout(() => {
          setType("hidden");
          if (values[fieldName] !== "") {
            setFieldValue(fieldName, "");
          }
        }, 300); // Matches the transition time
      } else {
        fieldElement.classList.remove("hidden-field");
        setType(initialType || "text");
      }
    }
  }, [values, showFieldOn, setFieldValue, fieldName, type, initialType]);

  useEffect(() => {
    if (showFieldOn.length) return;
    if (type !== initialType) {
      setType(initialType || "text");
    }
  }, [initialType, type]);

  const InputElement =
    {
      text: TextInput,
      textarea: TextAreaInput,
      select: SelectInput,
      checkbox: CheckBox,
      hidden: Hidden,
      checkboxGroup: CheckBoxGroup,
      radioboxGroup: RadioBoxGroup,
      date: DateInput,
    }[type] || TextInput;

  return (
    <div
      className={csx(css, "container", { disabled: fieldDisabled })}
      data-disabled={fieldDisabled}
    >
      <div>
        <InputElement {...props} type={type} />
        {tooltip && (
          <Tooltip
            content={tooltip}
            bottom={displayFieldErrors ? 40 : 35}
            right={1}
          />
        )}
        {!!touched[fieldName] && !!errors[fieldName] && (
          <Tooltip
            error
            right={tooltip ? 20 : 0}
            bottom={displayFieldErrors ? 40 : 35}
            content={errors[fieldName]?.toString() || ""}
          />
        )}
        {displayFieldErrors && !!touched[fieldName] && !!errors[fieldName] && (
          <div className={csx(css, "errorMessage")}>
            {errors[fieldName]?.toString() || ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default Component;
