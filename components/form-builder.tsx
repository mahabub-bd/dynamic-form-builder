"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FormElement, FormElementType, FormLayout } from "@/lib/types";
import {
  Code,
  Eye,
  HelpCircle,
  LayoutGrid,
  LayoutList,
  PenTool,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CodePreview from "./code-preview";
import ElementSidebar from "./element-sidebar";
import ExportDialog from "./export-dialog";
import FormCanvas from "./form-canvas";
import FormPreview from "./form-preview";
import ImportDialog from "./import-dialog";

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(
    null
  );
  const [formLayout, setFormLayout] = useState<FormLayout>("one-column");
  const [formName, setFormName] = useState("My Form");
  const nextIdRef = useRef(1);

  const handleAddElement = (type: FormElementType) => {
    const newElement: FormElement = {
      id: `element-${nextIdRef.current++}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Label`,
      name: `${type}${nextIdRef.current - 1}`,
      required: false,
      placeholder:
        type === "text" || type === "textarea"
          ? "Enter text here..."
          : undefined,
      options:
        type === "select" || type === "radio" || type === "checkbox-group"
          ? [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]
          : undefined,
    };

    setFormElements([...formElements, newElement]);
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (updatedElement: FormElement) => {
    setFormElements(
      formElements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      )
    );
    setSelectedElement(updatedElement);
  };

  const handleRemoveElement = (id: string) => {
    setFormElements(formElements.filter((el) => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const handleMoveElement = (dragIndex: number, hoverIndex: number) => {
    const dragElement = formElements[dragIndex];
    const newElements = [...formElements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, dragElement);
    setFormElements(newElements);
  };

  const handleImportDynamicFields = (dynamicFields: any) => {
    try {
      if (dynamicFields.Form && dynamicFields.Form.FormName) {
        setFormName(dynamicFields.Form.FormName);
      }

      const importedElements: FormElement[] = dynamicFields.FormFields.map(
        (field: any, index: number) => {
          let type: FormElementType = "text";

          switch (field.FieldType.Type.toLowerCase()) {
            case "text":
              type = "text";
              break;
            case "dropdown":
              type = "select";
              break;
            case "datetime":
              type = "date";
              break;
            case "multicheck":
              type = "checkbox-group";
              break;
            default:
              type = "text";
          }

          const element: FormElement = {
            id: `element-${index + 1}`,
            type,
            label: field.FieldCaption,
            name: field.FieldName,
            required:
              field.FieldType.Required === true ||
              field.FieldType.Required === "YES",
            placeholder:
              type === "text" || type === "textarea"
                ? `Enter ${field.FieldCaption}...`
                : undefined,
          };

          if (field.FieldType.MaxLength) {
            element.maxLength = Number.parseInt(field.FieldType.MaxLength);
          }

          if (
            field.FieldType.DefaultValues &&
            Array.isArray(field.FieldType.DefaultValues) &&
            field.FieldType.DefaultValues.length > 0
          ) {
            if (typeof field.FieldType.DefaultValues[0] === "object") {
              element.options = field.FieldType.DefaultValues;
            }
          }

          if (field.FieldType.ValueType === "NUMBERONLY") {
            element.valueType = "number";
          } else if (field.FieldType.ValueType === "TEXTONLY") {
            element.valueType = "text";
          } else if (field.FieldType.ValueType === "TEXTWITHNUMBER") {
            element.valueType = "alphanumeric";
          } else if (field.FieldType.ValueType === "DATEANDTIME") {
            element.valueType = "datetime";
          }

          return element;
        }
      );

      setFormElements(importedElements);
      nextIdRef.current = importedElements.length + 1;
    } catch (error) {
      console.error("Error importing dynamic fields:", error);
      alert("Error importing dynamic fields. Please check the format.");
    }
  };

  const [showClearFormDialog, setShowClearFormDialog] = useState(false);

  const handleClearForm = () => {
    setShowClearFormDialog(true);
  };

  const confirmClearForm = () => {
    setFormElements([]);
    setSelectedElement(null);
    setShowClearFormDialog(false);
  };

  const generateExportData = () => {
    const formFields = formElements.map((element, index) => {
      let fieldType = "text";
      let valueType = "";
      let defaultValues: any[] = [];

      switch (element.type) {
        case "text":
          fieldType = "text";
          valueType =
            element.valueType === "number"
              ? "NUMBERONLY"
              : element.valueType === "text"
              ? "TEXTONLY"
              : element.valueType === "alphanumeric"
              ? "TEXTWITHNUMBER"
              : "";
          break;
        case "textarea":
          fieldType = "text";
          valueType = "TEXTONLY";
          break;
        case "select":
          fieldType = "DropDown";
          defaultValues = element.options || [];
          break;
        case "checkbox-group":
          fieldType = "MultiCheck";
          defaultValues = element.options || [];
          break;
        case "radio":
          fieldType = "DropDown";
          defaultValues = element.options || [];
          break;
        case "date":
          fieldType = element.valueType === "datetime" ? "DATETIME" : "DATE";
          valueType = element.valueType === "datetime" ? "DATEANDTIME" : "";
          break;
        case "file":
          fieldType = "FILE";
          break;
      }

      return {
        FieldId: (index + 1).toString(),
        FieldCaption: element.label,
        FieldName: element.name,
        FieldType: {
          Type: fieldType,
          DefaultValues: defaultValues,
          MaxLength: element.maxLength?.toString() || "",
          ValueType: valueType,
          Required: element.required ? "YES" : "NO",
        },
      };
    });

    return {
      project: {
        id: 10001,
        name: "Dynamic Form Builder",
      },
      Form: {
        FormId: 1,
        FormName: formName,
      },
      FormFields: formFields,
    };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Form Builder</h2>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <ElementSidebar onAddElement={handleAddElement} />

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Form Layout</h3>
            </div>
            <RadioGroup
              value={formLayout}
              onValueChange={(value) => setFormLayout(value as FormLayout)}
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="one-column" id="one-column" />
                <Label
                  htmlFor="one-column"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutList className="h-4 w-4 text-muted-foreground" />
                  One Column
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="two-columns" id="two-columns" />
                <Label
                  htmlFor="two-columns"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                  Two Columns
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PenTool className="h-4 w-4 text-muted-foreground" />
              Actions
            </h3>
            <div className="flex flex-col space-y-2">
              <ImportDialog onImport={handleImportDynamicFields} />
              <ExportDialog
                getExportData={generateExportData}
                formName={formName}
                setFormName={setFormName}
              />
              <Button
                variant="outline"
                onClick={handleClearForm}
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Form
              </Button>

              <Dialog
                open={showClearFormDialog}
                onOpenChange={setShowClearFormDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear Form</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to clear the form? All elements will
                      be removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowClearFormDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmClearForm}>
                      Clear Form
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <Tabs
            defaultValue="editor"
            className="bg-white rounded-lg border shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How to Use
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How to Use the Form Builder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        1
                      </span>
                      Drag elements from the sidebar onto the canvas
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        2
                      </span>
                      Click on an element to edit its properties
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        3
                      </span>
                      Rearrange elements by dragging them within the canvas
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        4
                      </span>
                      Choose between one or two column layout
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        5
                      </span>
                      Import dynamic fields from JSON structure
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        6
                      </span>
                      Export your form to save or share it
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        7
                      </span>
                      Preview your form in the Preview tab
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                        8
                      </span>
                      Get the generated code in the Code tab
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="editor" className="space-y-4 mt-2">
              <FormCanvas
                elements={formElements}
                selectedElementId={selectedElement?.id}
                onSelectElement={setSelectedElement}
                onUpdateElement={handleUpdateElement}
                onRemoveElement={handleRemoveElement}
                onMoveElement={handleMoveElement}
                layout={formLayout}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-2">
              <FormPreview
                elements={formElements}
                layout={formLayout}
                formName={formName}
              />
            </TabsContent>

            <TabsContent value="code" className="mt-2">
              <CodePreview
                elements={formElements}
                layout={formLayout}
                formName={formName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DndProvider>
  );
}
