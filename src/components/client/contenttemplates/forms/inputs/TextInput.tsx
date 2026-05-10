"use client";

import { InputContainer, InputLabel } from "./Common";
import { useFormikContext, Field } from "formik";
import { IMaskInput } from "react-imask";
import { AsYouType } from "libphonenumber-js";
import { useEffect, useState, useRef } from "react";
import { CustomFieldDef } from "@src/lib/types";
import countryData from "@config/EUCountryData.json";

const getPhoneNumberPrefix = (countryCode: string): string => {
  if (!countryCode) return "+";
  const getCountryDate = countryData.Countries.filter(
    (c) => c.Id.toUpperCase() === countryCode
  )[0];
  const phonePrefix = getCountryDate?.PhonePrefix;
  return phonePrefix ? `${phonePrefix}` : "+";
};

const Component: React.FC<CustomFieldDef> = (props) => {
  const { label = "", fieldName = "", masking = {}, otherSettings } = props;
  const {
    errors,
    touched = {},
    values,
    setFieldValue,
    setTouched,
  } = useFormikContext<any>();

  const fieldValue = values[fieldName] ?? "";
  const { mask, uppercase = false, pattern } = masking;
  const [active, setActive] = useState(false);
  const { setAutoPhonePrefix = false, placeholder = "", disabled = false } = otherSettings || {};

  const getCountryCode = () => {
    return values.CountryCode || values.countrycode || values.country || "";
  };
  
  const countryCode = getCountryCode();
  const prevCountryCodeRef = useRef<string>("");
  
  useEffect(() => {
    if (!setAutoPhonePrefix || !countryCode) return;
  
    // Only update if country code actually changed
    if (countryCode === prevCountryCodeRef.current) return;
  
    prevCountryCodeRef.current = countryCode;
  
    const phonePrefix = getPhoneNumberPrefix(countryCode);
    const currentFieldValue = values[fieldName] ?? "";
  
    // Case 1: Empty or just "+"
    if (!currentFieldValue || currentFieldValue === "+") {
      setFieldValue(fieldName, phonePrefix);
      return;
    }
  
    // Case 2: Field starts with a different prefix
    if (
      currentFieldValue.startsWith("+") &&
      !currentFieldValue.startsWith(phonePrefix)
    ) {
      const currentPrefix = currentFieldValue.match(/^\+\d+/)?.[0] || "";
      const numberPart = currentFieldValue.replace(currentPrefix, "").trim();
      setFieldValue(fieldName, phonePrefix + numberPart);
      return;
    }
  
    // Case 3: Field doesn’t start with "+"
    if (!currentFieldValue.startsWith("+")) {
      setFieldValue(fieldName, phonePrefix + currentFieldValue.trim());
    }
  }, [countryCode, setAutoPhonePrefix, fieldName, values[fieldName], setFieldValue]);
  

  const inputGotFocus = (e: React.FocusEvent<any>) => {
    if (!mask) return;
    setActive(true);

    setTimeout(() => {
      const countryCode = getCountryCode();
      e.target.setSelectionRange(countryCode.length, countryCode.length);
    }, 100);
  };

  return (
    <InputContainer error={!!touched[fieldName] && !!errors[fieldName]}>
      <InputLabel>{label}</InputLabel>
      {Object.values(masking).some((v) => v) ? (
        setAutoPhonePrefix ? (
          <Field
            name={fieldName}
            value={fieldValue}
            data-value={fieldValue}
            placeholder={placeholder}
            onBlur={() => {
              setTouched({ ...touched, [fieldName]: true });
              if (fieldValue === "+") {
                setFieldValue(fieldName, "");
              }
            }}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setFieldValue(
                fieldName,
                e.currentTarget.value.startsWith("+")
                  ? new AsYouType().input(e.currentTarget.value)
                  : "+"
              );
            }}
            disabled={disabled}
          />
        ) : (
          <IMaskInput
            type="text"
            mask={mask || pattern || ""}
            lazy={!active}
            name={fieldName}
            value={fieldValue}
            data-value={fieldValue}
            onAccept={(value: any) => setFieldValue(fieldName, value)}
            onBlur={() => {
              setTouched({ ...touched, [fieldName]: true });
              setActive(false);
            }}
            onFocus={inputGotFocus}
            prepare={(str: string) => {
              return uppercase ? str.toUpperCase() : str;
            }}
            disabled={disabled}
          />
        )
      ) : (
        <Field
          name={fieldName}
          value={fieldValue}
          data-value={fieldValue}
          placeholder={placeholder}
          onBlur={() => setTouched({ ...touched, [fieldName]: true })}
          disabled={disabled}
        />
      )}
    </InputContainer>
  );
};

export default Component;
