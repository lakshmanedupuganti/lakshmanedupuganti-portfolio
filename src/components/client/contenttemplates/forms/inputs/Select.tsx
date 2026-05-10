"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { InputContainer, InputLabel } from "./Common";
import { useFormikContext } from "formik";
import { useOnClickOutside } from "@clientlib/hooks";
import css from "./Select.module.scss";
import { csx } from "@src/lib/utility/stylings/classes";
import { CustomFieldDef, FieldOptions } from "@src/lib/types";
import { ChevronDown } from "@src/components/server/utility/IconSVGFile";

const Component: React.FC<CustomFieldDef> = (props) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [results, setResults] = useState<FieldOptions[]>([]);
  const [searchField, setSearchField] = useState<string>();
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    label = "",
    fieldName = "",
    options = [],
    placeholder = "Select",
  } = props;

  const { errors, touched, values, setFieldValue, submitForm } =
    useFormikContext<any>();

  const setField = useMemo<any>(
    () => (v?: { value: string; label: string }, searchTerm?: string) => {
      if (v) {
        setFieldValue(fieldName, v.value ?? v.label);
        setSearchField(v.label);
      } else {
        setFieldValue(fieldName, "");
        setSearchField(searchTerm || "");
      }
    },
    [fieldName, setFieldValue, submitForm]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Get the select element dynamically to ensure we're checking the current element
      const selectElement = ref.current?.querySelector('select') as HTMLSelectElement | null;

      // Only handle keyboard events when the select element is focused AND the dropdown is open
      // This prevents interfering with page scrolling when the select is not actively being used
      if (document.activeElement !== selectElement || !focus) {
        return; // Allow default scroll behavior when select is not focused or dropdown is closed
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length) {
          setActiveIndex(Math.min(results.length - 1, activeIndex + 1));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length) {
          setActiveIndex(Math.max(0, activeIndex - 1));
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        setField(results[activeIndex]);
      }
    };

    try {
      if (focus) {
        document
          .querySelector('[data-active="true"]')
          ?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    } catch (error) {
      console.log(error);
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeIndex, results, setField, focus]);

  useEffect(() => {
    setResults(
      options.filter((v) =>
        v.label.toLowerCase().startsWith((searchField || "").toLowerCase())
      )
    );
    setActiveIndex(0);
  }, [searchField, options]);

  useEffect(() => {
    if (values[fieldName]) {
      setFieldValue(fieldName, values[fieldName]);
      setSearchField(options.find((v) => v.value === values[fieldName])?.label);
    }
  }, [fieldName, setFieldValue, options, values]);

  useOnClickOutside(ref, () => setFocus(false));
  return (
    <InputContainer
      error={!!touched[fieldName] && !!errors[fieldName]}
      ref={ref}
    >
      <InputLabel>{label}</InputLabel>
      <select
        className={csx(css, "inputSelect", {
          error: !!touched[fieldName] && !!errors[fieldName],
        })}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => {
          const inputValue = e.currentTarget.value;
          const selectedOption =
            options.find((v) => v.value === inputValue) ||
            options.find((v) => v.label === inputValue);
          setField(
            selectedOption,
            e.currentTarget.value
          );
        }}
        data-value={values[fieldName]}
        value={values[fieldName]}
      >
        <option className={csx(css, "option")}>{placeholder}</option>
        {options.map((v, i) => (
          <option
            className={csx(css, "option", { active: i === activeIndex })}
            key={`${v.value || v.label}_${i}`}
            value={v.value || v.label}
            data-active={i === activeIndex}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => {
              setField(v);
              setFocus(false);
            }}
          >
            {v.label}
          </option>
        ))}
      </select>
      <div className={csx(css, "selectIcon")}>
        <ChevronDown width={15} height={15} />
      </div>
    </InputContainer>
  );
};

export default Component;
