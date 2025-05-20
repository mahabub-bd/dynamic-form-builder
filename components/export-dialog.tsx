"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Download, FileJson } from "lucide-react";
import { useState } from "react";

interface ExportDialogProps {
  getExportData: () => any;
  formName: string;
  setFormName: (name: string) => void;
}

export default function ExportDialog({
  getExportData,
  formName,
  setFormName,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    setOpen(true);
  };

  const exportData = getExportData();
  const exportJson = JSON.stringify(exportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formName.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        onClick={handleExport}
        className="w-full flex items-center gap-2"
      >
        <FileJson className="h-4 w-4" />
        Export Form
      </Button>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Export Form</DialogTitle>
          <DialogDescription>
            Your form configuration in JSON format. Copy or download it to save
            or share.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="form-name" className="text-right">
              Form Name
            </Label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Textarea
            value={exportJson}
            readOnly
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download JSON
          </Button>
          <Button onClick={handleCopy} className="flex items-center gap-2">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
