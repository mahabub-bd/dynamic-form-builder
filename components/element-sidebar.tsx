"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import type { FormElementType } from "@/lib/types";
import {
  AlignLeft,
  Blocks,
  CalendarIcon,
  CheckIcon as CheckboxIcon,
  CheckSquare,
  CircleIcon,
  KeyIcon,
  ListIcon,
  TextIcon,
  Upload,
} from "lucide-react";
import { useDrag } from "react-dnd";

interface ElementSidebarProps {
  onAddElement: (type: FormElementType) => void;
}

interface ElementButtonProps {
  type: FormElementType;
  icon: React.ReactNode;
  label: string;
  onAddElement: (type: FormElementType) => void;
}

function ElementButton({
  type,
  icon,
  label,
  onAddElement,
}: ElementButtonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}
      onClick={() => onAddElement(type)}
    >
      <Card className="p-3 hover:bg-muted transition-colors flex items-center gap-2 border-dashed hover:border-primary/50">
        <div className="text-primary">{icon}</div>
        <span>{label}</span>
      </Card>
    </div>
  );
}

export default function ElementSidebar({ onAddElement }: ElementSidebarProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Blocks className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Form Elements</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Drag elements onto the canvas or click to add
      </p>
      <div className="space-y-2">
        {elements.map((element) => (
          <ElementButton
            key={element.type}
            type={element.type}
            icon={element.icon}
            label={element.label}
            onAddElement={onAddElement}
          />
        ))}
      </div>
    </div>
  );
}
