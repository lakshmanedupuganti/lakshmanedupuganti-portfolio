"use client";

import { CustomFieldDef } from "@src/lib/types";
import { Field } from "formik";

const Component: React.FC<CustomFieldDef> = (props) => {
  const { fieldName = "" } = props;
  return <Field type="hidden" name={fieldName} />;
};

export default Component;
