"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormElement } from "@/lib/types";
import {
  AlignLeft,
  CalendarIcon,
  CheckSquare,
  CircleIcon,
  Grip,
  KeyIcon,
  ListIcon,
  TextIcon,
  Upload,
  X,
} from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { PasswordInput } from "./password-input";

interface FormElementComponentProps {
  element: FormElement;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function FormElementComponent({
  element,
  index,
  isSelected,
  onSelect,
  onRemove,
  onMove,
}: FormElementComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "FORM_ELEMENT_CARD",
    item: () => {
      return { id: element.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "FORM_ELEMENT_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const getElementIcon = () => {
    switch (element.type) {
      case "text":
        return <TextIcon className="h-4 w-4 text-primary" />;
      case "password":
        return <KeyIcon className="h-4 w-4 text-primary" />;
      case "textarea":
        return <AlignLeft className="h-4 w-4 text-primary" />;
      case "select":
        return <ListIcon className="h-4 w-4 text-primary" />;
      case "checkbox":
        return <CheckSquare className="h-4 w-4 text-primary" />;
      case "checkbox-group":
        return <CheckSquare className="h-4 w-4 text-primary" />;
      case "radio":
        return <CircleIcon className="h-4 w-4 text-primary" />;
      case "date":
        return <CalendarIcon className="h-4 w-4 text-primary" />;
      case "file":
        return <Upload className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const renderPreview = () => {
    switch (element.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={element.id}
              name={element.name}
              placeholder={element.placeholder}
              required={element.required}
              disabled
              type={element.valueType === "number" ? "number" : "text"}
            />
          </div>
        );
      case "password":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <PasswordInput
              id={element.id}
              name={element.name}
              placeholder={element.placeholder}
              required={element.required}
              disabled
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <Textarea
              id={element.id}
              name={element.name}
              placeholder={element.placeholder}
              required={element.required}
              disabled
            />
          </div>
        );
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <Select disabled>
              <SelectTrigger id={element.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={element.id} disabled />
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
          </div>
        );
      case "checkbox-group":
        return (
          <div className="space-y-2">
            <Label>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="space-y-2">
              {element.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox disabled />
                  <Label>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            <Label>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <RadioGroup disabled>
              {element.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${element.id}-${option.value}`}
                  />
                  <Label htmlFor={`${element.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={element.id}
              name={element.name}
              type="date"
              required={element.required}
              disabled
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={element.id}
              name={element.name}
              type="file"
              required={element.required}
              disabled
              className="cursor-not-allowed"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={preview}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      className={`relative ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      <Card
        className={`p-4 transition-all ${
          isSelected ? "shadow-md" : "hover:shadow-sm"
        }`}
      >
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
          <div
            ref={ref}
            className="cursor-move flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <Grip size={16} className="text-muted-foreground" />
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X size={14} />
          </Button>
        </div>
        {renderPreview()}
      </Card>
    </div>
  );
}
