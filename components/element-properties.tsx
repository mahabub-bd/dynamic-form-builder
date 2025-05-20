"use client"

import { useState } from "react"
import type { FormElement } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ElementPropertiesProps {
  element: FormElement
  onUpdate: (element: FormElement) => void
}

export default function ElementProperties({ element, onUpdate }: ElementPropertiesProps) {
  const [newOptionLabel, setNewOptionLabel] = useState("")
  const [newOptionValue, setNewOptionValue] = useState("")

  const handleChange = (field: keyof FormElement, value: any) => {
    onUpdate({
      ...element,
      [field]: value,
    })
  }

  const handleAddOption = () => {
    if (!newOptionLabel || !newOptionValue) return

    const newOptions = [...(element.options || []), { label: newOptionLabel, value: newOptionValue }]

    onUpdate({
      ...element,
      options: newOptions,
    })

    setNewOptionLabel("")
    setNewOptionValue("")
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(element.options || [])]
    newOptions.splice(index, 1)

    onUpdate({
      ...element,
      options: newOptions,
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="element-label">Label</Label>
        <Input id="element-label" value={element.label} onChange={(e) => handleChange("label", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="element-name">Name (for form data)</Label>
        <Input id="element-name" value={element.name} onChange={(e) => handleChange("name", e.target.value)} />
      </div>

      {(element.type === "text" || element.type === "textarea" || element.type === "number") && (
        <div className="space-y-2">
          <Label htmlFor="element-placeholder">Placeholder</Label>
          <Input
            id="element-placeholder"
            value={element.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
          />
        </div>
      )}

      {element.type === "text" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="element-value-type">Value Type</Label>
            <Select value={element.valueType || "text"} onValueChange={(value) => handleChange("valueType", value)}>
              <SelectTrigger id="element-value-type">
                <SelectValue placeholder="Select value type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="number">Number Only</SelectItem>
                <SelectItem value="alphanumeric">Alphanumeric (Text with Numbers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="element-min-length">Min Length</Label>
            <Input
              id="element-min-length"
              type="number"
              value={element.minLength || ""}
              onChange={(e) => handleChange("minLength", e.target.value === "" ? undefined : Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="element-max-length">Max Length</Label>
            <Input
              id="element-max-length"
              type="number"
              value={element.maxLength || ""}
              onChange={(e) => handleChange("maxLength", e.target.value === "" ? undefined : Number(e.target.value))}
              min={0}
            />
          </div>

          {element.valueType === "number" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="element-min">Min Value</Label>
                <Input
                  id="element-min"
                  type="number"
                  value={element.min || ""}
                  onChange={(e) => handleChange("min", e.target.value === "" ? undefined : Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="element-max">Max Value</Label>
                <Input
                  id="element-max"
                  type="number"
                  value={element.max || ""}
                  onChange={(e) => handleChange("max", e.target.value === "" ? undefined : Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="element-step">Step</Label>
                <Input
                  id="element-step"
                  type="number"
                  value={element.step || ""}
                  onChange={(e) => handleChange("step", e.target.value === "" ? undefined : Number(e.target.value))}
                  step="any"
                />
              </div>
            </>
          )}
        </>
      )}

      {element.type === "textarea" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="element-min-length">Min Length</Label>
            <Input
              id="element-min-length"
              type="number"
              value={element.minLength || ""}
              onChange={(e) => handleChange("minLength", e.target.value === "" ? undefined : Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="element-max-length">Max Length</Label>
            <Input
              id="element-max-length"
              type="number"
              value={element.maxLength || ""}
              onChange={(e) => handleChange("maxLength", e.target.value === "" ? undefined : Number(e.target.value))}
              min={0}
            />
          </div>
        </>
      )}

      {element.type === "number" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="element-min">Min Value</Label>
            <Input
              id="element-min"
              type="number"
              value={element.min || ""}
              onChange={(e) => handleChange("min", e.target.value === "" ? undefined : Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="element-max">Max Value</Label>
            <Input
              id="element-max"
              type="number"
              value={element.max || ""}
              onChange={(e) => handleChange("max", e.target.value === "" ? undefined : Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="element-step">Step</Label>
            <Input
              id="element-step"
              type="number"
              value={element.step || ""}
              onChange={(e) => handleChange("step", e.target.value === "" ? undefined : Number(e.target.value))}
              step="any"
            />
          </div>
        </>
      )}

      {element.type === "date" && (
        <>
          <div className="flex items-center space-x-2">
            <Switch
              id="disable-past-dates"
              checked={element.disablePastDates || false}
              onCheckedChange={(checked) => handleChange("disablePastDates", checked)}
            />
            <Label htmlFor="disable-past-dates">Disable Past Dates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="disable-future-dates"
              checked={element.disableFutureDates || false}
              onCheckedChange={(checked) => handleChange("disableFutureDates", checked)}
            />
            <Label htmlFor="disable-future-dates">Disable Future Dates</Label>
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="element-required"
          checked={element.required || false}
          onCheckedChange={(checked) => handleChange("required", checked)}
        />
        <Label htmlFor="element-required">Required</Label>
      </div>

      {(element.type === "select" || element.type === "radio" || element.type === "checkbox-group") && (
        <div className="space-y-4">
          <Label>Options</Label>

          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option.label}
                  onChange={(e) => {
                    const newOptions = [...(element.options || [])]
                    newOptions[index] = { ...option, label: e.target.value }
                    handleChange("options", newOptions)
                  }}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={option.value}
                  onChange={(e) => {
                    const newOptions = [...(element.options || [])]
                    newOptions[index] = { ...option, value: e.target.value }
                    handleChange("options", newOptions)
                  }}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Add New Option</Label>
            <div className="flex items-center gap-2">
              <Input
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddOption}
                disabled={!newOptionLabel || !newOptionValue}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {element.type === "textarea" && (
        <div className="space-y-2">
          <Label htmlFor="element-rows">Rows</Label>
          <Input
            id="element-rows"
            type="number"
            value={element.rows || 3}
            onChange={(e) => handleChange("rows", Number.parseInt(e.target.value) || 3)}
            min={1}
          />
        </div>
      )}
    </Card>
  )
}
