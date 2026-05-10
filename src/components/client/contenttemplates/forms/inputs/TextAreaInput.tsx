"use client";

import { InputContainer, InputLabel } from "./Common";
import { useFormikContext, Field } from "formik";
import { CustomFieldDef } from "@src/lib/types";

const Component: React.FC<CustomFieldDef> = (props) => {
  const { label = "", fieldName = "", placeholder = "" } = props;
  const { errors, touched = {}, values, setTouched } = useFormikContext<any>();

  return (
    <InputContainer error={!!touched[fieldName] && !!errors[fieldName]}>
      <InputLabel>{label}</InputLabel>
      <Field
        name={fieldName}
        as="textarea"
        placeholder={placeholder}
        data-value={values[fieldName]}
        onBlur={() => setTouched({ ...touched, [fieldName]: true })}
      />
    </InputContainer>
  );
};

export default Component;
