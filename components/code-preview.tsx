"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FormElement, FormLayout } from "@/lib/types";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  elements: FormElement[];
  layout: FormLayout;
  formName: string;
}

export default function CodePreview({
  elements,
  layout,
  formName,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  if (elements.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Add elements to generate code</p>
      </Card>
    );
  }

  const generateComponentCode = () => {
    let imports = `import { Button } from "@/components/ui/button"\n`;
    imports += `import { useForm } from "react-hook-form"\n`;
    imports += `import { zodResolver } from "@hookform/resolvers/zod"\n`;
    imports += `import * as z from "zod"\n`;
    imports += `import { useState, useEffect } from "react"\n`;

    const usedComponents = new Set<string>();

    elements.forEach((element) => {
      switch (element.type) {
        case "text":
        case "date":
        case "file":
        case "number":
          usedComponents.add("Input");
          break;
        case "password":
          usedComponents.add("PasswordInput");
          break;
        case "textarea":
          usedComponents.add("Textarea");
          break;
        case "select":
          usedComponents.add("Select");
          usedComponents.add("SelectContent");
          usedComponents.add("SelectItem");
          usedComponents.add("SelectTrigger");
          usedComponents.add("SelectValue");
          break;
        case "checkbox":
        case "checkbox-group":
          usedComponents.add("Checkbox");
          break;
        case "radio":
          usedComponents.add("RadioGroup");
          usedComponents.add("RadioGroupItem");
          break;
      }
      usedComponents.add("Label");
      usedComponents.add("FormField");
      usedComponents.add("FormItem");
      usedComponents.add("FormLabel");
      usedComponents.add("FormControl");
      usedComponents.add("FormMessage");
      usedComponents.add("FormDescription");
    });

    usedComponents.forEach((component) => {
      if (component === "Input") {
        imports += `import { Input } from "@/components/ui/input"\n`;
      } else if (component === "PasswordInput") {
        imports += `import { PasswordInput } from "@/components/password-input"\n`;
      } else if (component === "Textarea") {
        imports += `import { Textarea } from "@/components/ui/textarea"\n`;
      } else if (component === "Select") {
        imports += `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"\n`;
      } else if (component === "Checkbox") {
        imports += `import { Checkbox } from "@/components/ui/checkbox"\n`;
      } else if (component === "RadioGroup") {
        imports += `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\n`;
      } else if (component === "Label") {
        imports += `import { Label } from "@/components/ui/label"\n`;
      } else if (
        component === "FormField" ||
        component === "FormItem" ||
        component === "FormLabel" ||
        component === "FormControl" ||
        component === "FormMessage" ||
        component === "FormDescription"
      ) {
        imports += `import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"\n`;

        usedComponents.delete("FormField");
        usedComponents.delete("FormItem");
        usedComponents.delete("FormLabel");
        usedComponents.delete("FormControl");
        usedComponents.delete("FormMessage");
        usedComponents.delete("FormDescription");
      }
    });

    let zodSchema = "const formSchema = z.object({\n";
    elements.forEach((element) => {
      let validation = "";

      if (element.type === "number") {
        validation = `z.coerce.number()`;
        if (element.required) {
          validation += `.min(${
            element.min !== undefined ? element.min : 0
          }, { message: 'Required' })`;
        } else {
          validation += `.optional()`;
        }
        if (element.max !== undefined) {
          validation += `.max(${element.max}, { message: 'Value must be less than or equal to ${element.max}' })`;
        }
      } else if (element.type === "checkbox-group") {
        validation = `z.array(z.string())`;
        if (element.required) {
          validation += `.min(1, { message: 'Required' })`;
        }
      } else if (element.type === "checkbox") {
        validation = `z.boolean()`;
        if (element.required) {
          validation += `.refine(val => val === true, { message: 'Required' })`;
        }
      } else if (element.type === "date") {
        validation = `z.string()`;
        if (element.required) {
          validation += `.min(1, { message: 'Required' })`;
        } else {
          validation += `.optional()`;
        }
      } else if (element.type === "text" || element.type === "textarea") {
        validation = `z.string()`;

        if (element.valueType === "number") {
          validation += `.regex(/^\\d+$/, { message: 'Must contain only numbers' })`;
        } else if (element.valueType === "alphanumeric") {
          validation += `.regex(/^[a-zA-Z0-9\\s]+$/, { message: 'Must contain only letters, numbers, and spaces' })`;
        }

        if (element.minLength) {
          validation += `.min(${element.minLength}, { message: 'Must be at least ${element.minLength} characters' })`;
        }

        if (element.maxLength) {
          validation += `.max(${element.maxLength}, { message: 'Must be at most ${element.maxLength} characters' })`;
        }

        if (element.required) {
          validation += `.min(1, { message: 'Required' })`;
        } else {
          validation += `.optional()`;
        }
      } else if (element.type === "password") {
        validation = `z.string()`;

        // Add password-specific validation
        validation += `.min(8, { message: 'Password must be at least 8 characters' })`;

        if (element.minLength && element.minLength > 8) {
          validation += `.min(${element.minLength}, { message: 'Must be at least ${element.minLength} characters' })`;
        }

        if (element.maxLength) {
          validation += `.max(${element.maxLength}, { message: 'Must be at most ${element.maxLength} characters' })`;
        }

        if (element.required) {
          validation += `.min(1, { message: 'Required' })`;
        } else {
          validation += `.optional()`;
        }
      } else if (element.type === "file") {
        if (element.required) {
          validation = `z.instanceof(File, { message: 'Required' })`;
        } else {
          validation = `z.instanceof(File).optional()`;
        }
      } else {
        validation = `z.string()`;
        if (element.required) {
          validation += `.min(1, { message: 'Required' })`;
        } else {
          validation += `.optional()`;
        }
      }

      zodSchema += `  ${element.name}: ${validation},\n`;
    });
    zodSchema += "})\n\n";

    zodSchema += "type FormValues = z.infer<typeof formSchema>\n\n";

    let passwordInputComponent = "";
    if (elements.some((element) => element.type === "password")) {
      passwordInputComponent = `

import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={\`pr-10 \${className || ""}\`}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>
    </div>
  )
}
`;
    }

    // Generate file preview component if needed
    let filePreviewComponent = "";
    if (elements.some((element) => element.type === "file")) {
      filePreviewComponent = `
// File preview component
import { X } from 'lucide-react'

function FilePreview({ file, onRemove, className = "" }) {
  const [preview, setPreview] = useState(null)
  const [fileType, setFileType] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      setFileType(null)
      return
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setFileType("image")
      }
      reader.readAsDataURL(file)
    } else {
      setFileType("other")
    }

    // Cleanup
    return () => {
      if (preview && fileType === "image") {
        URL.revokeObjectURL(preview)
      }
    }
  }, [file])

  if (!file) return null

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className={\`mt-2 \${className}\`}>
      {fileType === "image" && preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-48 max-w-full rounded-md object-contain border p-1"
          />
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
`;
    }

    const formElements = elements
      .map((element) => {
        switch (element.type) {
          case "text":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <Input 
            placeholder="${element.placeholder || ""}" 
            {...field} 
            ${element.valueType === "number" ? 'type="number"' : ""}
            ${element.minLength ? `minLength={${element.minLength}}` : ""}
            ${element.maxLength ? `maxLength={${element.maxLength}}` : ""}
            className={form.formState.errors.${
              element.name
            } ? "border-destructive" : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "password":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <PasswordInput 
            placeholder="${element.placeholder || ""}" 
            {...field} 
            ${element.minLength ? `minLength={${element.minLength}}` : ""}
            ${element.maxLength ? `maxLength={${element.maxLength}}` : ""}
            className={form.formState.errors.${
              element.name
            } ? "border-destructive" : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "number":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <Input 
            type="number" 
            placeholder="${element.placeholder || ""}" 
            ${element.min !== undefined ? `min={${element.min}}` : ""}
            ${element.max !== undefined ? `max={${element.max}}` : ""}
            ${element.step !== undefined ? `step={${element.step}}` : ""}
            {...field}
            className={form.formState.errors.${
              element.name
            } ? "border-destructive" : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "textarea":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <Textarea 
            placeholder="${element.placeholder || ""}" 
            rows={${element.rows || 3}}
            ${element.minLength ? `minLength={${element.minLength}}` : ""}
            ${element.maxLength ? `maxLength={${element.maxLength}}` : ""}
            {...field}
            className={form.formState.errors.${
              element.name
            } ? "border-destructive" : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "select":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
      <FormControl>
        <SelectTrigger className={form.formState.errors.${
          element.name
        } ? "border-destructive" : ""}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        ${element.options
          ?.map(
            (option) =>
              `<SelectItem value="${option.value}">${option.label}</SelectItem>`
          )
          .join("\n            ")}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)}
/>`;
          case "checkbox":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
          <FormMessage />
        </div>
      </FormItem>
    )}
  />`;
          case "checkbox-group":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={() => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <div className="space-y-2">
          ${element.options
            ?.map(
              (option) => `
          <FormField
            control={form.control}
            name="${element.name}"
            render={({ field }) => {
              return (
                <FormItem
                  key="${option.value}"
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("${option.value}")}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, "${option.value}"])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== "${option.value}"
                              )
                            )
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    ${option.label}
                  </FormLabel>
                </FormItem>
              )
            }}
          />`
            )
            .join("\n")}
        </div>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "radio":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            ${element.options
              ?.map(
                (
                  option
                ) => `<FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="${option.value}" />
              </FormControl>
              <FormLabel className="font-normal">
                ${option.label}
              </FormLabel>
            </FormItem>`
              )
              .join("\n            ")}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "date":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
        <FormControl>
          <Input
            type="date"
            {...field}
            ${
              element.disablePastDates
                ? `min={new Date().toISOString().split('T')[0]}`
                : ""
            }
            ${
              element.disableFutureDates
                ? `max={new Date().toISOString().split('T')[0]}`
                : ""
            }
            className={form.formState.errors.${
              element.name
            } ? "border-destructive" : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
          case "file":
            return `
  <FormField
    control={form.control}
    name="${element.name}"
    render={({ field: { value, onChange, ...fieldProps } }) => {
      const [fileState, setFileState] = useState(null)
      
      return (
        <FormItem>
          <FormLabel>${element.label}${element.required ? " *" : ""}</FormLabel>
          <FormControl>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                onChange(file)
                setFileState(file)
              }}
              {...fieldProps}
              className={\`border-dashed \${form.formState.errors.${
                element.name
              } ? "border-destructive" : ""}\`}
            />
          </FormControl>
          <FilePreview 
            file={fileState} 
            onRemove={() => {
              onChange(null)
              setFileState(null)
              // Reset the file input
              const fileInput = document.querySelector(\`input[name="${
                element.name
              }"]\`)
              if (fileInput) fileInput.value = ""
            }}
          />
          <FormMessage />
        </FormItem>
      )
    }}
  />`;
          default:
            return "";
        }
      })
      .join("\n");

    const layoutClass =
      layout === "two-columns"
        ? 'className="grid grid-cols-1 md:grid-cols-2 gap-6"'
        : 'className="space-y-6"';

    return `${imports}
${passwordInputComponent}
${filePreviewComponent}
${zodSchema}
export default function ${formName.replace(/\s+/g, "")}() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${elements
  .map((element) => {
    if (element.type === "checkbox") {
      return `      ${element.name}: false,`;
    } else if (element.type === "checkbox-group") {
      return `      ${element.name}: [],`;
    } else if (element.type === "number") {
      return `      ${element.name}: ${
        element.required
          ? element.min !== undefined
            ? element.min
            : 0
          : "undefined"
      },`;
    } else if (element.type === "file") {
      return `      ${element.name}: undefined,`;
    } else {
      return `      ${element.name}: "",`;
    }
  })
  .join("\n")}
    },
  })

  function onSubmit(data: FormValues) {
    // Handle form submission
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">${formName}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div ${layoutClass}>
${formElements}
          </div>
          
          <div className="pt-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}`;
  };

  const componentCode = generateComponentCode();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Generated Code</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(componentCode)}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy Code
            </>
          )}
        </Button>
      </div>

      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm">
        <code>{componentCode}</code>
      </pre>
    </Card>
  );
}
