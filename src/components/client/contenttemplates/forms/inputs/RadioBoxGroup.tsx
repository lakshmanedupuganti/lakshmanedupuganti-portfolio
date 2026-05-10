"use client";

import { InputContainer, CheckboxLabel } from "./Common";
import css from "./Common.module.scss";
import { Field, useFormikContext } from "formik";
import {
  CheckBoxUnselected,
  CheckBoxDone,
} from "@src/components/server/utility/IconSVGFile";
import { CustomFieldDef } from "@src/lib/types";
import { Col, Row } from "react-bootstrap";

const RadioBoxGroup: React.FC<CustomFieldDef> = ({
  label = "",
  fieldName = "",
  options,
}) => {
  const {
    errors,
    touched = {},
    values,
    setFieldValue,
  } = useFormikContext<any>();

  const selectedValueFromForm = values[fieldName] || "";

  const handleChange = (optionValue: string) => {
    setFieldValue(fieldName, optionValue);
  };

  if (!options) return null;

  return (
    <div className="mb-4">
      <InputContainer error={Boolean(touched[fieldName] && errors[fieldName])}>
        <div className={css.checkboxLabel}>
          <span dangerouslySetInnerHTML={{ __html: label }} />
        </div>
        <Row>
          {options.map((option) => {
            const isSelected = selectedValueFromForm === option.value;

            return (
              <Col key={option.value} lg={6} data-fieldname={option.value}>
                <Field
                  name={fieldName}
                  id={`${fieldName}_${option.value}`}
                  type="radio"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                />
                <CheckboxLabel htmlFor={`${fieldName}_${option.value}`}>
                  <span>
                    {isSelected ? (
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

export default RadioBoxGroup;
