import { FormElementType } from "@/lib/types";
import { useDrag } from "react-dnd";
import { Card } from "./ui/card";
interface ElementButtonProps {
  type: FormElementType;
  icon: React.ReactNode;
  label: string;
  onAddElement: (type: FormElementType) => void;
}
export default function ElementButton({
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
      ref={drag as unknown as React.Ref<HTMLDivElement>}
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
