import { FormElementType } from "@/lib/types";
import {
  AlignLeft,
  CalendarIcon,
  CheckIcon as CheckboxIcon,
  CheckSquare,
  CircleIcon,
  KeyIcon,
  ListIcon,
  TextIcon,
  Upload,
} from "lucide-react";

const elements = [
  {
    type: "text" as FormElementType,
    icon: <TextIcon size={18} />,
    label: "Input",
  },
  {
    type: "password" as FormElementType,
    icon: <KeyIcon size={18} />,
    label: "Password",
  },
  {
    type: "textarea" as FormElementType,
    icon: <AlignLeft size={18} />,
    label: "Text Area",
  },
  {
    type: "select" as FormElementType,
    icon: <ListIcon size={18} />,
    label: "Select",
  },
  {
    type: "checkbox" as FormElementType,
    icon: <CheckSquare size={18} />,
    label: "Checkbox",
  },
  {
    type: "checkbox-group" as FormElementType,
    icon: <CheckboxIcon size={18} />,
    label: "Checkbox Group",
  },
  {
    type: "radio" as FormElementType,
    icon: <CircleIcon size={18} />,
    label: "Radio",
  },
  {
    type: "date" as FormElementType,
    icon: <CalendarIcon size={18} />,
    label: "Date Input",
  },
  {
    type: "file" as FormElementType,
    icon: <Upload size={18} />,
    label: "File Upload",
  },
];

export default elements;
