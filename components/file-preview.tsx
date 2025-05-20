"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FilePreviewProps {
  file: File | null;
  onRemove?: () => void;
  className?: string;
}

export function FilePreview({
  file,
  onRemove,
  className = "",
}: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "other" | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setFileType(null);
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFileType("image");
      };
      reader.readAsDataURL(file);
    } else {
      setFileType("other");
    }

    // Cleanup
    return () => {
      if (preview && fileType === "image") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  if (!file) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className={`mt-2 ${className}`}>
      {fileType === "image" && preview ? (
        <div className="relative">
          <Image
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
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
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
  );
}
