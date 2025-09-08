// components/ui/FileUpload.tsx
'use client'
import { useState } from "react";

type FileUploadProps = {
  label: string;
  onFileSelect: (file: File | null) => void;
};

export default function FileUpload({ label, onFileSelect }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className="flex flex-col">
      <label className="font-medium">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setFileName(file ? file.name : "");
            onFileSelect(file);
          }}
          className="hidden"
          id={label}
        />
        <label
          htmlFor={label}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Choose File
        </label>
        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
      </div>
    </div>
  );
}
