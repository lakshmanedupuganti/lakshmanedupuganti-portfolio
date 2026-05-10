"use client";

import { InputContainer, CheckboxLabel } from "./Common";
import { Field, useFormikContext } from "formik";
import {
  CheckBoxUnselected,
  CheckBoxDone,
} from "@src/components/server/utility/IconSVGFile";
import { CustomFieldDef } from "@src/lib/types";

const CheckBox: React.FC<CustomFieldDef> = ({ label = "", fieldName = "", otherFieldOptions }) => {
  const { selectedValue } = otherFieldOptions || {};
  const { errors, touched = {}, values, setFieldValue } = useFormikContext<any>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const valueToSet = selectedValue !== undefined ? (isChecked ? selectedValue : false) : isChecked;
    setFieldValue(fieldName, valueToSet);
  };

  const isChecked = selectedValue !== undefined ? values[fieldName] === selectedValue : values[fieldName];

  return (
    <InputContainer error={Boolean(touched[fieldName] && errors[fieldName])}>
      <Field
        name={fieldName}
        id={fieldName}
        type="checkbox"
        onChange={handleChange}
        checked={isChecked}
      />
      <CheckboxLabel htmlFor={fieldName}>
        <span>
          {isChecked ? (
            <CheckBoxDone width={25} height={25} />
          ) : (
            <CheckBoxUnselected width={25} height={25} />
          )}
        </span>
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </CheckboxLabel>
    </InputContainer>
  );
};

export default CheckBox;