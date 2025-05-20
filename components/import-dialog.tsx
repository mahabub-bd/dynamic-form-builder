"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileJson, Clipboard } from "lucide-react"

interface ImportDialogProps {
  onImport: (data: any) => void
}

export default function ImportDialog({ onImport }: ImportDialogProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(jsonInput)

      if (!parsedData.FormFields || !Array.isArray(parsedData.FormFields)) {
        throw new Error("Invalid format: FormFields array is required")
      }

      onImport(parsedData)
      setError(null)
      setOpen(false)
      setJsonInput("")
    } catch (err) {
      setError("Invalid JSON format. Please check your input.")
    }
  }

  const handlePaste = () => {
    const sampleData = {
      project: { id: 10001, name: "Sample Project" },
      Form: { FormId: 1, FormName: "Sample Form" },
      FormFields: [
        {
          FieldId: "1",
          FieldCaption: "Full Name",
          FieldName: "fullName",
          FieldType: {
            Type: "text",
            DefaultValues: [],
            MaxLength: "100",
            ValueType: "TEXTONLY",
            Required: true,
          },
        },
        {
          FieldId: "2",
          FieldCaption: "Email",
          FieldName: "email",
          FieldType: {
            Type: "text",
            DefaultValues: [],
            MaxLength: "100",
            ValueType: "TEXTWITHNUMBER",
            Required: true,
          },
        },
        {
          FieldId: "3",
          FieldCaption: "Country",
          FieldName: "country",
          FieldType: {
            Type: "DropDown",
            DefaultValues: [
              { label: "United States", value: "us" },
              { label: "Canada", value: "ca" },
              { label: "United Kingdom", value: "uk" },
            ],
            MaxLength: "50",
            ValueType: "",
            Required: true,
          },
        },
      ],
    }

    setJsonInput(JSON.stringify(sampleData, null, 2))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FileJson className="h-4 w-4" />
          Import Dynamic Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Import Dynamic Fields</DialogTitle>
          <DialogDescription>Paste your dynamic fields JSON structure below to generate a form.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste your JSON here..."
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value)
              setError(null)
            }}
            className="min-h-[300px] font-mono text-sm"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handlePaste} type="button" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Paste Sample
          </Button>
          <Button onClick={handleImport} type="submit">
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
