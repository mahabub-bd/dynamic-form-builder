export type FormElementType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "radio"
  | "date"
  | "file"
  | "password"
  | "number";

export type FormLayout = "one-column" | "two-columns";

export interface FormElementOption {
  label: string;
  value: string;
}

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  options?: FormElementOption[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  minLength?: number;
  valueType?: "text" | "number" | "alphanumeric" | "datetime" | "password";
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
}
