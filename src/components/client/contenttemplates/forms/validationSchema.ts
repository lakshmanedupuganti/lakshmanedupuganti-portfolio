"use client";

import { CustomFieldDef, CountryData, FieldValidationType } from "@lib/types";
import * as Yup from "yup";
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import countryDataRow from "@config/EUCountryData.json";

type TranslationFunc = (s: string) => string;
type FormValues = Record<string, any>;

// Type-safe country data
const countryData = countryDataRow as CountryData;

// Validation error messages
const ERROR_MESSAGES = {
  REQUIRED: "error_required",
  INVALID_EMAIL: "error_invalid_email",
  INVALID_FORMAT: "error_invalid_format",
  INVALID_POSTAL_CODE_FORMAT: "error_invalid_postal_code_format",
  INVALID_VALUE: "error_invalid_value",
  TOO_SHORT: "error_too_short",
  TOO_LONG: "error_too_long",
  INVALID_COMBINED_VALUES: "error_invalid_combined_values",
} as const;

// Validation types
type RangeValidation = { min?: number; max?: number };
type CombinedValidation = {
  fieldNames: string[];
  validation: FieldValidationType;
  range: RangeValidation;
};

// Helper interfaces
interface FieldContext {
  fieldName: string;
  label: string;
  type: string;
  validations: FieldValidationType[];
  options?: Array<{ value?: string; label: string }>;
  otherFieldOptions?: { selectedValue?: string };
  otherSettings?: {
    setAutoPhonePrefix?: boolean;
    showFieldOn?: Array<{ fieldName?: string; value?: string }>;
  };
}

interface ValidationContext {
  parent: FormValues;
  path: string;
}

/**
 * Creates a validation schema for form fields
 * @param fields - Array of field definitions
 * @param t - Translation function
 * @param values - Current form values
 * @returns Yup validation schema
 */
export const getValidationSchema = (
  fields: CustomFieldDef[],
  t: TranslationFunc,
  values: FormValues
): Yup.ObjectSchema<any> => {
  // Create efficient field lookup map
  const fieldMap = new Map<string, FieldContext>();

  fields.forEach((field) => {
    fieldMap.set(field.fieldName, {
      fieldName: field.fieldName,
      label: field.label || field.fieldName,
      type: field.type || "text",
      validations: field.validations || [],
      options: field.options,
      otherFieldOptions: field.otherFieldOptions,
      otherSettings: field.otherSettings,
    });
  });

  // Extract combined validations for cross-field validation
  const combinedValidations = extractCombinedValidations(fields);

  // Build schema for each field
  const fieldSchemas: Record<string, Yup.StringSchema> = {};

  fields.forEach((field) => {
    const fieldContext = fieldMap.get(field.fieldName);
    if (!fieldContext) return;

    const schema = buildFieldSchema(
      fieldContext,
      t,
      values,
      combinedValidations
    );
    fieldSchemas[field.fieldName] = schema;
  });

  return Yup.object().shape(fieldSchemas);
};

/**
 * Extracts combined validations from field definitions
 */
const extractCombinedValidations = (
  fields: CustomFieldDef[]
): CombinedValidation[] => {
  const combinedValidations: CombinedValidation[] = [];

  fields.forEach((field) => {
    const validations = field.validations || [];

    validations.forEach((validation) => {
      if (validation.type === "combined" && validation.fieldNames) {
        combinedValidations.push({
          fieldNames: validation.fieldNames,
          validation,
          range: validation.range || {},
        });
      }
    });
  });

  return combinedValidations;
};

/**
 * Builds validation schema for a single field
 */
const buildFieldSchema = (
  field: FieldContext,
  t: TranslationFunc,
  formValues: FormValues,
  combinedValidations: CombinedValidation[]
): Yup.StringSchema => {
  let schema = Yup.string();

  // // Skip validation if field is hidden
  // if (isFieldHidden(field, formValues)) {
  //   return schema;
  // }

  // Apply individual field validations
  schema = applyFieldValidations(schema, field, t);

  // Apply combined validations
  schema = applyCombinedValidations(schema, field, combinedValidations, t);

  // Apply phone validation if needed
  if (field.otherSettings?.setAutoPhonePrefix) {
    const rangeValidation = field.validations.find(
      (v) => v.type === "range"
    )?.range;
    schema = applyPhoneValidation(schema, t, rangeValidation);
  }

  return schema;
};

/**
 * Checks if a field should be hidden based on showFieldOn conditions
 */
const isFieldHidden = (
  field: FieldContext,
  formValues: FormValues
): boolean => {
  const showFieldOn = field.otherSettings?.showFieldOn || [];
  if (showFieldOn.length === 0) return false;
  // Field should be hidden if ANY of the showFieldOn conditions are NOT met
  return showFieldOn.some(({ fieldName = "", value }) => {
    if (!fieldName || !value) return true; // Hide if condition is invalid

    const fieldValue = formValues[fieldName];

    if (value.includes("/")) {
      const valuesToCheck = value.split("/").map((v) => v.trim());
      return !valuesToCheck.includes(fieldValue);
    }

    return fieldValue !== value;
  });
};

/**
 * Applies individual field validations
 */
const applyFieldValidations = (
  schema: Yup.StringSchema,
  field: FieldContext,
  t: TranslationFunc
): Yup.StringSchema => {
  field.validations.forEach((validation) => {
    switch (validation.type) {
      case "required":
        schema = applyRequiredValidation(schema, field, t);
        break;
      case "email":
        schema = schema.email(t(ERROR_MESSAGES.INVALID_EMAIL));
        break;
      case "regex":
        schema = applyRegexValidation(schema, validation, t);
        break;
      case "range":
        schema = applyRangeValidation(schema, validation.range, t);
        break;
      case "EU_PostalCode":
        schema = applyEUPostalCodeValidation(schema, t);
        break;
      case "EU_VATNumber":
        schema = applyEUVATNumberValidation(schema, t);
        break;
      case "Country_Based_Regex":
        schema = applyCountryBasedRegexValidation(schema, validation, t);
        break;
      case "combined":
        // Combined validations are handled separately
        break;
      case "optional":
        // No validation needed for optional fields
        break;
      default:
        break;
    }
  });

  return schema;
};

/**
 * Applies required validation with field-specific logic
 */
const applyRequiredValidation = (
  schema: Yup.StringSchema,
  field: FieldContext,
  t: TranslationFunc
): Yup.StringSchema => {
  schema = schema.required(t(ERROR_MESSAGES.REQUIRED));

  if (field.type === "checkbox") {
    const selectedValue = field.otherFieldOptions?.selectedValue;
    if (selectedValue) {
      schema = schema.oneOf([selectedValue], t(ERROR_MESSAGES.REQUIRED));
    } else {
      schema = schema.oneOf(["true"], t(ERROR_MESSAGES.REQUIRED));
    }
  }

  if (field.type === "select" && field.options) {
    const validValues = field.options.map(
      (option) => option.value ?? option.label
    );
    schema = schema.oneOf(validValues, t(ERROR_MESSAGES.REQUIRED));
  }

  return schema;
};

/**
 * Applies regex validation
 */
const applyRegexValidation = (
  schema: Yup.StringSchema,
  validation: FieldValidationType,
  t: TranslationFunc
): Yup.StringSchema => {
  if (validation.regex) {
    try {
      const regex = new RegExp(validation.regex);
      const displayRegex = validation.regex.replace(/\\/g, "");

      schema = schema.matches(
        regex,
        t(ERROR_MESSAGES.INVALID_FORMAT).replace("{regex}", displayRegex)
      );
    } catch (error) {
      // Invalid regex - log error and skip validation
      console.error(`Invalid regex pattern: ${validation.regex}`, error);
    }
  }

  return schema;
};

/**
 * Applies range validation
 */
const applyRangeValidation = (
  schema: Yup.StringSchema,
  range: RangeValidation | undefined,
  t: TranslationFunc
): Yup.StringSchema => {
  if (!range) return schema;

  if (range.min !== undefined) {
    schema = schema.min(
      range.min,
      t(ERROR_MESSAGES.TOO_SHORT).replace("{min}", range.min.toString())
    );
  }

  if (range.max !== undefined) {
    schema = schema.max(
      range.max,
      t(ERROR_MESSAGES.TOO_LONG).replace("{max}", range.max.toString())
    );
  }

  return schema;
};

/**
 * Applies EU postal code validation
 */
const applyEUPostalCodeValidation = (
  schema: Yup.StringSchema,
  t: TranslationFunc
): Yup.StringSchema => {
  return schema.test(
    "postalCode",
    t(ERROR_MESSAGES.INVALID_POSTAL_CODE_FORMAT),
    function (value, context) {
      const { parent } = context as ValidationContext;
      const countryCode = parent.CountryCode || parent.countrycode;

      // Get postal code format from country data for dynamic error message
      let postalCodeFormat = "";
      if (countryCode) {
        const country = countryData.Countries.find(
          (c) => c.Id === countryCode.toLowerCase()
        );
        // Access postalCodeFormat using bracket notation since JSON uses lowercase
        postalCodeFormat = (country as any)?.postalCodeFormat || "";
      }

      // Validate postal code
      const isValid = validateEUPostalCode(value, countryCode);

      // If validation fails and we have a format, create custom error with format
      if (!isValid && postalCodeFormat) {
        const errorMessage = t(ERROR_MESSAGES.INVALID_POSTAL_CODE_FORMAT);
        return this.createError({
          message: errorMessage.replace("{format}", postalCodeFormat),
        });
      }

      return isValid;
    }
  );
};

/**
 * Applies EU language text validation
 */
const applyEURegionalTextValidation = (
  schema: Yup.StringSchema,
  t: TranslationFunc
): Yup.StringSchema => {
  return schema.test(
    "languageText",
    t(ERROR_MESSAGES.INVALID_VALUE),
    (value, context) => {
      const { parent } = context as ValidationContext;
      const countryCode = parent.CountryCode || parent.countrycode;
      return validateLanguageTextValidation(value, countryCode);
    }
  );
};

/**
 * Applies EU VAT number validation
 */
const applyEUVATNumberValidation = (
  schema: Yup.StringSchema,
  t: TranslationFunc
): Yup.StringSchema => {
  return schema.test(
    "vatNumber",
    t(ERROR_MESSAGES.INVALID_VALUE),
    (value, context) => {
      const { parent } = context as ValidationContext;
      const countryCode = parent.CountryCode || parent.countrycode;
      return validateEUVATNumber(value, countryCode);
    }
  );
};

/**
 * Applies combined validations for cross-field validation
 */
const applyCombinedValidations = (
  schema: Yup.StringSchema,
  field: FieldContext,
  combinedValidations: CombinedValidation[],
  t: TranslationFunc
): Yup.StringSchema => {
  const relevantValidations = combinedValidations.filter((validation) =>
    validation.fieldNames.includes(field.fieldName)
  );

  relevantValidations.forEach((combinedValidation) => {
    const testName = `combined_${combinedValidation.fieldNames.join("_")}`;
    const errorMessage = buildCombinedErrorMessage(combinedValidation, t);

    schema = schema.test(testName, errorMessage, (value, context) => {
      const { parent } = context as ValidationContext;
      const fieldValues = combinedValidation.fieldNames.map(
        (fieldName) => parent[fieldName] || ""
      );
      return validateCombined(fieldValues, combinedValidation.validation);
    });
  });

  return schema;
};

/**
 * Applies country-based regex validation
 */
const applyCountryBasedRegexValidation = (
  schema: Yup.StringSchema,
  validation: FieldValidationType,
  t: TranslationFunc
): Yup.StringSchema => {
  const { countryBasedRegex } = validation;
  return schema.test(
    "countryBasedRegex",
    t(ERROR_MESSAGES.INVALID_VALUE),
    (value, context) => {
      const { parent } = context as ValidationContext;
      const countryCode = parent.CountryCode || parent.countrycode;
      return validateCountryBasedRegex(value, countryCode, countryBasedRegex);
    }
  );
};

/**
 * Validates country-based regex against country-specific regex
 */
const validateCountryBasedRegex = (
  value: string | undefined,
  countryCode: string | undefined,
  countryBasedRegex: Record<string, string> | undefined
): boolean => {
  if (!value || !countryCode) return true;
  const regex = new RegExp(countryBasedRegex?.[countryCode] || "");
  return regex.test(value) ? true : false;
};

/**
 * Builds error message for combined validation
 */
const buildCombinedErrorMessage = (
  validation: CombinedValidation,
  t: TranslationFunc
): string => {
  const { range = {} } = validation.validation;
  const { min = 0, max = 0 } = range;

  return t(ERROR_MESSAGES.INVALID_COMBINED_VALUES)
    .replace("{min}", min.toString())
    .replace("{max}", max.toString())
    .replace("{fieldNames}", validation.fieldNames.join(" + "));
};

/**
 * Applies phone number validation
 */
const applyPhoneValidation = (
  schema: Yup.StringSchema,
  t: TranslationFunc,
  range?: RangeValidation
): Yup.StringSchema => {
  return schema.test("phone", t(ERROR_MESSAGES.INVALID_VALUE), (value) => {
    if (!value) return true;

    try {
      const phone = parsePhoneNumberFromString(value);
      if (!phone) return false;

      const numberLength = phone.nationalNumber.length;

      if (range?.min !== undefined && range?.max !== undefined) {
        return numberLength >= range.min && numberLength <= range.max;
      }

      return isValidPhoneNumber(value);
    } catch (error) {
      // Invalid phone number format
      return false;
    }
  });
};

/**
 * Validates EU postal code against country-specific regex
 */
const validateEUPostalCode = (
  value: string | undefined,
  countryCode: string | undefined
): boolean => {
  if (!value || !countryCode) return true;

  try {
    const country = countryData.Countries.find(
      (c) => c.Id === countryCode.toLowerCase()
    );

    if (!country?.PostalCodeRegex) return true;

    const regex = new RegExp(country.PostalCodeRegex);
    return regex.test(value);
  } catch (error) {
    // Invalid regex pattern - log error and allow value
    console.error(
      `Invalid postal code regex for country ${countryCode}:`,
      error
    );
    return true;
  }
};

/**
 * Validates EU VAT number against country-specific regex
 */
const validateEUVATNumber = (
  value: string | undefined,
  countryCode: string | undefined
): boolean => {
  if (!value || !countryCode) return true;

  try {
    const country = countryData.Countries.find(
      (c) => c.Id === countryCode.toLowerCase()
    );

    if (!country?.VATRegex) return true;

    const regex = new RegExp(country.VATRegex);
    return regex.test(value);
  } catch (error) {
    // Invalid regex pattern - log error and allow value
    console.error(`Invalid VAT regex for country ${countryCode}:`, error);
    return true;
  }
};

/**
 * Validates Translated field value against country-specific regex
 */
const validateLanguageTextValidation = (
  value: string | undefined,
  countryCode: string | undefined
): boolean => {
  if (!value || !countryCode) return true;

  try {
    const country = countryData.Countries.find(
      (c) => c.Id === countryCode.toLowerCase()
    );

    if (!country?.LanguageRegex) return true;

    const regex = new RegExp(country.LanguageRegex);
    return regex.test(value);
  } catch (error) {
    // Invalid regex pattern - log error and allow value
    console.error(`Invalid language regex for country ${countryCode}:`, error);
    return true;
  }
};

/**
 * Validates combined field values against range constraints
 */
const validateCombined = (
  fieldValues: string[],
  validation: FieldValidationType
): boolean => {
  const { range = {} } = validation;
  const { min = 0, max = 0 } = range;

  const combinedText = fieldValues.join(" ");
  const combinedLength = combinedText.length || 0;

  return combinedLength >= min && combinedLength <= max;
};
