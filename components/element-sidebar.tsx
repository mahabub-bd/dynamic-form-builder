import elements from "@/constants/data";
import { FormElementType } from "@/lib/types";
import { Blocks } from "lucide-react";
import ElementButton from "./element-button";

interface ElementSidebarProps {
  onAddElement: (type: FormElementType) => void;
}

export default function ElementSidebar({ onAddElement }: ElementSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Blocks className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Form Elements</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Click to add elements to your form.
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
