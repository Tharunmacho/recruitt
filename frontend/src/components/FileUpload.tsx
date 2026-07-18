import React, { useRef, useState } from 'react';
import { Upload, FileCheck, Trash2, FileText, Eye } from 'lucide-react';
import { DocumentUpload } from '../types';

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  currentFile: DocumentUpload | null;
  onUpload: (file: DocumentUpload) => void;
  onClear: () => void;
  onView?: () => void;
}

export default function FileUpload({
  id,
  label,
  accept,
  currentFile,
  onUpload,
  onClear,
  onView
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

    // Try reading file as base64 for image files and PDFs
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload({
          name: file.name,
          size: formattedSize,
          uploadedAt: new Date().toISOString().split('T')[0],
          base64: reader.result as string,
          file: file
        });
      };
      reader.readAsDataURL(file);
    } else {
      onUpload({
        name: file.name,
        size: formattedSize,
        uploadedAt: new Date().toISOString().split('T')[0],
        file: file
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
    <div className="space-y-3" id={`fileupload-container-${id}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 block tracking-wide uppercase font-mono">
          {label}
        </label>
        {currentFile && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
            Verified
          </span>
        )}
      </div>

      {currentFile ? (
        <div 
          id={`fileupload-active-${id}`}
          className="group relative flex items-center justify-between p-4 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 backdrop-blur-md shadow-[0_4px_12px_-4px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(16,185,129,0.15)] hover:border-emerald-300/60"
        >
          {/* Decorative left accent line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center space-x-4 overflow-hidden pl-2">
            <div className="relative p-2.5 bg-white rounded-xl shadow-sm border border-emerald-100/50 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform duration-300">
              {currentFile.base64 && currentFile.base64.startsWith('data:image/') ? (
                <img 
                  src={currentFile.base64} 
                  alt={label} 
                  className="w-9 h-9 rounded-lg object-cover shadow-inner"
                  referrerPolicy="no-referrer"
                />
              ) : currentFile.name?.toLowerCase().match(/\.(pdf|docx|doc|txt)$/i) ? (
                <FileText className="w-6 h-6" />
              ) : (
                <FileCheck className="w-6 h-6" />
              )}
            </div>
            
            <div className="text-left overflow-hidden flex flex-col justify-center">
              <p className="text-sm font-bold text-slate-800 truncate tracking-tight">
                {currentFile.name}
              </p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[10px] text-slate-500 font-mono font-medium">
                  {currentFile.size}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentFile.uploadedAt}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            {onView && (
              <button
                type="button"
                onClick={onView}
                className="p-2 mr-1 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-400 hover:text-indigo-500 rounded-xl transition-all duration-300 shrink-0 hover:shadow-sm"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              id={`fileupload-clear-btn-${id}`}
              onClick={onClear}
              className="p-2 mr-1 bg-white hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-slate-400 hover:text-rose-500 rounded-xl transition-all duration-300 shrink-0 hover:shadow-sm"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          id={`fileupload-dropzone-${id}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50/50 shadow-inner scale-[1.02]'
              : 'border-slate-300/70 bg-slate-50/30 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)]'
          }`}
        >
          {/* Subtle animated background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <input
            type="file"
            id={`file-input-${id}`}
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className={`relative p-3.5 rounded-2xl transition-all duration-500 mb-3 ${
            isDragging 
              ? 'bg-indigo-100 text-indigo-600 shadow-md scale-110' 
              : 'bg-white text-slate-400 group-hover:text-indigo-500 group-hover:shadow-[0_4px_15px_-3px_rgba(99,102,241,0.2)] group-hover:-translate-y-1 border border-slate-100 group-hover:border-indigo-100'
          }`}>
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-700 tracking-tight relative z-10 group-hover:text-slate-900 transition-colors">
            Click to upload or drag & drop
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-mono tracking-widest font-semibold relative z-10">
            {accept.replace(/\./g, ' ').toUpperCase()} files only
          </p>
        </div>
      )}
    </div>
  );
}
