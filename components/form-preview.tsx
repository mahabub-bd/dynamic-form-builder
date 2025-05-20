"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormElement, FormLayout } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FilePreview } from "./file-preview";
import { PasswordInput } from "./password-input";

interface FormPreviewProps {
  elements: FormElement[];
  layout: FormLayout;
  formName: string;
}

export default function FormPreview({
  elements,
  layout,
  formName,
}: FormPreviewProps) {
  const [fileStates, setFileStates] = useState<Record<string, File | null>>({});

  const schemaObj: Record<string, any> = {};

  elements.forEach((element) => {
    switch (element.type) {
      case "checkbox-group":
        let checkboxGroupValidation = z.array(z.string());
        if (element.required) {
          checkboxGroupValidation = checkboxGroupValidation.min(1, {
            message: "Required",
          });
        }
        schemaObj[element.name] = checkboxGroupValidation;
        break;

      case "checkbox":
        let checkboxValidation = z.boolean();
        if (element.required) {
          checkboxValidation = checkboxValidation.refine(
            (val) => val === true,
            {
              message: "Required",
            }
          );
        }
        schemaObj[element.name] = checkboxValidation;
        break;

      case "date":
        if (element.required) {
          const dateValidation = z.string().min(1, { message: "Required" });

          schemaObj[element.name] = dateValidation;
        } else {
          schemaObj[element.name] = z.string().optional();
        }
        break;

      case "text":
      case "textarea":
      case "password":
        let textValidation = z.string();

        if (element.valueType === "number") {
          textValidation = textValidation.regex(/^\d+$/, {
            message: "Must contain only numbers",
          });
        } else if (element.valueType === "alphanumeric") {
          textValidation = textValidation.regex(/^[a-zA-Z0-9\s]+$/, {
            message: "Must contain only letters, numbers, and spaces",
          });
        } else if (element.type === "password") {
          textValidation = textValidation.min(8, {
            message: "Password must be at least 8 characters",
          });
        }

        if (element.minLength) {
          textValidation = textValidation.min(element.minLength, {
            message: `Must be at least ${element.minLength} characters`,
          });
        }

        if (element.maxLength) {
          textValidation = textValidation.max(element.maxLength, {
            message: `Must be at most ${element.maxLength} characters`,
          });
        }

        // Make it optional or required after applying other constraints
        if (element.required) {
          textValidation = textValidation.min(1, {
            message: "Required",
          });
        } else {
          textValidation = textValidation.optional();
        }

        schemaObj[element.name] = textValidation;
        break;

      case "file":
        if (element.required) {
          schemaObj[element.name] = z.instanceof(File, { message: "Required" });
        } else {
          schemaObj[element.name] = z.instanceof(File).optional();
        }
        break;

      default:
        let defaultValidation = z.string();
        if (element.required) {
          defaultValidation = defaultValidation.min(1, {
            message: "Required",
          });
        } else {
          defaultValidation = defaultValidation.optional();
        }
        schemaObj[element.name] = defaultValidation;
        break;
    }
  });

  const formSchema = z.object(schemaObj);
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: Record<string, any> = {};
  elements.forEach((element) => {
    if (element.type === "checkbox") {
      defaultValues[element.name] = false;
    } else if (element.type === "checkbox-group") {
      defaultValues[element.name] = [];
    } else if (element.type === "file") {
      defaultValues[element.name] = undefined;
    } else {
      defaultValues[element.name] = "";
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  const renderElement = (element: FormElement) => {
    switch (element.type) {
      case "text":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={element.placeholder}
                    {...field}
                    type={element.valueType === "number" ? "number" : "text"}
                    minLength={element.minLength}
                    maxLength={element.maxLength}
                    className={
                      form.formState.errors[element.name]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "password":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={element.placeholder}
                    {...field}
                    minLength={element.minLength}
                    maxLength={element.maxLength}
                    className={
                      form.formState.errors[element.name]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "textarea":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={element.placeholder}
                    rows={element.rows || 3}
                    minLength={element.minLength}
                    maxLength={element.maxLength}
                    {...field}
                    className={
                      form.formState.errors[element.name]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "select":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        form.formState.errors[element.name]
                          ? "border-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {element.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "checkbox":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {element.label}
                    {element.required && " *"}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        );
      case "checkbox-group":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={() => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <div className="space-y-2 border rounded-md p-4">
                  {element.options?.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name={element.name}
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "radio":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1 border rounded-md p-4"
                  >
                    {element.options?.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "date":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={
                      element.disablePastDates
                        ? new Date().toISOString().split("T")[0]
                        : undefined
                    }
                    max={
                      element.disableFutureDates
                        ? new Date().toISOString().split("T")[0]
                        : undefined
                    }
                    className={
                      form.formState.errors[element.name]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "file":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.name}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>
                  {element.label}
                  {element.required && " *"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      onChange(file);
                      setFileStates((prev) => ({
                        ...prev,
                        [element.name]: file,
                      }));
                    }}
                    {...fieldProps}
                    className={`border-dashed ${
                      form.formState.errors[element.name]
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                </FormControl>
                <FilePreview
                  file={fileStates[element.name] || null}
                  onRemove={() => {
                    onChange(null);
                    setFileStates((prev) => ({
                      ...prev,
                      [element.name]: null,
                    }));

                    const fileInput = document.querySelector(
                      `input[name="${element.name}"]`
                    ) as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 border shadow-sm">
      {elements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Add elements to see a preview of your form
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 pb-2 border-b">
            <FormIcon className="h-5 w-5 text-primary" />
            {formName}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div
                className={
                  layout === "two-columns"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }
              >
                {elements.map(renderElement)}
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" className="flex items-center gap-2">
                  <SendHorizontal className="h-4 w-4" />
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </Card>
  );
}

function FormIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}
