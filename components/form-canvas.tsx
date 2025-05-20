"use client";

import { Card } from "@/components/ui/card";
import type { FormElement, FormElementType, FormLayout } from "@/lib/types";
import { MousePointerIcon as MousePointerSquare, Pencil } from "lucide-react";
import { useDrop } from "react-dnd";
import ElementProperties from "./element-properties";
import FormElementComponent from "./form-element-component";

interface FormCanvasProps {
  elements: FormElement[];
  selectedElementId: string | undefined;
  onSelectElement: (element: FormElement | null) => void;
  onUpdateElement: (element: FormElement) => void;
  onRemoveElement: (id: string) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
  layout: FormLayout;
}

export default function FormCanvas({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onRemoveElement,
  onMoveElement,
  layout,
}: FormCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_ELEMENT",
    drop: (item: { type: FormElementType }) => {
      // This is handled by the parent component
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MousePointerSquare className="h-4 w-4 text-muted-foreground" />
          Form Canvas
        </h2>
        <div
          ref={drop}
          className={`min-h-[400px] border-2 rounded-lg p-4 ${
            isOver
              ? "border-primary border-dashed bg-primary/5"
              : "border-dashed border-muted"
          } ${elements.length === 0 ? "flex items-center justify-center" : ""}`}
        >
          {elements.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>Drag and drop elements here to build your form</p>
              <p className="text-sm mt-2">
                or click on elements in the sidebar
              </p>
            </div>
          ) : (
            <div
              className={
                layout === "two-columns"
                  ? "grid grid-cols-2 gap-4"
                  : "space-y-4"
              }
            >
              {elements.map((element, index) => (
                <FormElementComponent
                  key={element.id}
                  element={element}
                  index={index}
                  isSelected={element.id === selectedElementId}
                  onSelect={() => onSelectElement(element)}
                  onRemove={() => onRemoveElement(element.id)}
                  onMove={onMoveElement}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Pencil className="h-4 w-4 text-muted-foreground" />
          Properties
        </h2>
        {selectedElement ? (
          <ElementProperties
            element={selectedElement}
            onUpdate={onUpdateElement}
          />
        ) : (
          <Card className="p-6 text-center text-muted-foreground border-dashed">
            <p>Select an element to edit its properties</p>
            <p className="text-sm mt-2">Click on any element in the canvas</p>
          </Card>
        )}
      </div>
    </div>
  );
}
