import React, { useRef, useState } from 'react';
import { Upload, FileCheck, Trash2, FileText } from 'lucide-react';
import { DocumentUpload } from '../types';

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  currentFile: DocumentUpload | null;
  onUpload: (file: DocumentUpload) => void;
  onClear: () => void;
}

export default function FileUpload({
  id,
  label,
  accept,
  currentFile,
  onUpload,
  onClear
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    // Try reading file as base64 for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload({
          name: file.name,
          size: formattedSize,
          uploadedAt: new Date().toISOString().split('T')[0],
          base64: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      onUpload({
        name: file.name,
        size: formattedSize,
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2" id={`fileupload-container-${id}`}>
      <label className="text-[11px] font-bold text-slate-700 block tracking-wide uppercase font-mono">
        {label}
      </label>

      {currentFile ? (
        <div 
          id={`fileupload-active-${id}`}
          className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 backdrop-blur-sm transition-all duration-300"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-md shrink-0">
              {accept.includes('image') ? (
                currentFile.base64 ? (
                  <img 
                    src={currentFile.base64} 
                    alt={label} 
                    className="w-8 h-8 rounded object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileCheck className="w-5 h-5" />
                )
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-medium text-slate-800 truncate">
                {currentFile.name}
              </p>
              <p className="text-xs text-slate-600 font-mono font-medium">
                {currentFile.size} • Verified {currentFile.uploadedAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            id={`fileupload-clear-btn-${id}`}
            onClick={onClear}
            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors shrink-0"
            title="Remove document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          id={`fileupload-dropzone-${id}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/30'
          }`}
        >
          <input
            type="file"
            id={`file-input-${id}`}
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="p-3 bg-slate-200/60 group-hover:bg-blue-100/60 text-slate-500 group-hover:text-blue-600 rounded-full transition-all duration-300 mb-2">
            <Upload className="w-5 h-5" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider font-semibold">
            {accept.replace(/\./g, ' ').toUpperCase()} files only
          </p>
        </div>
      )}
    </div>
  );
}
