"use client";

import { InputContainer, CheckboxLabel, InputLabel } from "./Common";
import { Field, useFormikContext } from "formik";
import {
  CheckBoxUnselected,
  CheckBoxDone,
} from "@src/components/server/utility/IconSVGFile";
import { CustomFieldDef } from "@src/lib/types";
import { Col, Row } from "react-bootstrap";

const CheckBoxGroup: React.FC<CustomFieldDef> = ({
  label = "",
  fieldName = "",
  options,
  otherFieldOptions,
}) => {
  const { selectedValue } = otherFieldOptions || {};
  const {
    errors,
    touched = {},
    values,
    setFieldValue,
  } = useFormikContext<any>();

  // Get the selected values (ensure it's an array)
  const selectedValues = values[fieldName] ? values[fieldName].split(",") : [];

  const handleChange = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((val: string) => val !== optionValue) // Remove value if already selected
      : [...selectedValues, optionValue]; // Add value if not selected

    // Update the form field value as a comma-separated string
    setFieldValue(fieldName, newSelectedValues.join(","));
  };

  if (!options) return null;

  return (
    <div className="mb-4">
      <InputContainer error={Boolean(touched[fieldName] && errors[fieldName])}>
        <InputLabel dangerouslySetInnerHTML={{ __html: label }} />
        <Row>
          {options.map((option, index) => {
            const isChecked = selectedValues.includes(option.value); // Check if the option is selected

            return (
              <Col key={index} lg={6} data-fieldname={option.value}>
                <Field
                  key={index}
                  name={fieldName}
                  id={option.value} // Set a unique id per checkbox option
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleChange(option.value)} // Handle change for checkbox click
                />
                <CheckboxLabel htmlFor={option.value}>
                  <span>
                    {isChecked ? (
                      <CheckBoxDone width={25} height={25} />
                    ) : (
                      <CheckBoxUnselected width={25} height={25} />
                    )}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: option.label }} />
                </CheckboxLabel>
              </Col>
            );
          })}
        </Row>
      </InputContainer>
    </div>
  );
};

export default CheckBoxGroup;
