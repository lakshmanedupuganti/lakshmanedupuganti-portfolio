"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputContainer, InputLabel, parseDateFromString } from "./Common";
import { CustomFieldDef } from "@src/lib/types";
import { csx } from "@src/lib/utility/stylings/classes";
import { CalendarIcon } from "@src/components/server/utility/IconSVGFile";
import css from "./DateInput.dynamic.module.scss";

const DateInput: React.FC<CustomFieldDef> = ({
  label = "",
  fieldName = "",
  masking = {},
}) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rawValue = values?.[fieldName] ?? "";

  const displayFormat = masking.pattern || "MMMM dd, yyyy";

  useEffect(() => {
    if (!isTyping) {
      if (rawValue instanceof Date && !isNaN(rawValue.getTime())) {
        const formatted = format(rawValue, displayFormat);
        setInputValue(formatted);
      } else if (typeof rawValue === "string" && rawValue.trim() !== "") {
        const parsed = parseDateFromString(rawValue, displayFormat);
        if (parsed) {
          setInputValue(format(parsed, displayFormat));
        } else {
          setInputValue(rawValue);
        }
      } else {
        setInputValue("");
      }
    }
  }, [rawValue, isTyping, displayFormat]);

  const selectedDate = useMemo(() => {
    const parsedFromInput = parseDateFromString(inputValue, displayFormat);
    if (parsedFromInput) return parsedFromInput;

    const parsedFromValue = parseDateFromString(rawValue, displayFormat);
    return parsedFromValue;
  }, [inputValue, rawValue, displayFormat]);

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (!date) {
        setFieldValue(fieldName, "");
        setInputValue("");
        setIsTyping(false);
        return;
      }
      const formatted = format(date, displayFormat);
      setFieldValue(fieldName, formatted);
      setInputValue(formatted);
      setIsTyping(false);
    },
    [fieldName, displayFormat, setFieldValue]
  );

  const handleManualChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setIsTyping(true);

      const parsed = parseDateFromString(value, displayFormat);

      if (parsed) {
        setFieldValue(fieldName, format(parsed, displayFormat));
      }
    },
    [setFieldValue, fieldName, displayFormat]
  );

  const handleManualBlur = useCallback(() => {
    const trimmedInput = inputValue.trim();

    if (trimmedInput === "") {
      setFieldValue(fieldName, "");
      setInputValue("");
    } else {
      const parsed = parseDateFromString(trimmedInput, displayFormat);
      if (parsed) {
        const formatted = format(parsed, displayFormat);
        setFieldValue(fieldName, formatted);
        setInputValue(formatted);
      } else {
        setInputValue(rawValue);
      }
    }
    setIsTyping(false);
  }, [inputValue, displayFormat, setFieldValue, fieldName, rawValue]);

  return (
    <InputContainer error={!!errors[fieldName]}>
      {label && <InputLabel>{label}</InputLabel>}

      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        calendarClassName={csx(css, "calendar")}
        dateFormat={displayFormat}
        customInput={
          <div className={css.inputWrapper}>
            <input
              ref={inputRef}
              value={inputValue}
              type="text"
              placeholder={masking.mask ? displayFormat : ""}
              onChange={handleManualChange}
              onBlur={handleManualBlur}
              className={csx(css, "inputField")}
            />
            <div
              className={csx(css, "calendarIcon")}
              role="button"
              tabIndex={0}
            >
              <CalendarIcon />
            </div>
          </div>
        }
      />
    </InputContainer>
  );
};

export default DateInput;
