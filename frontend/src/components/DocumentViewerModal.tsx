import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download } from 'lucide-react';

interface DocumentViewerModalProps {
  url: string;
  filename: string;
  onClose: () => void;
}

export default function DocumentViewerModal({ url, filename, onClose }: DocumentViewerModalProps) {
  // Determine if it's likely an image to render natively, otherwise use iframe for PDF/docs
  const isImage = filename.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null || url.includes('image');

  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h3 className="text-sm font-bold text-slate-800 truncate pr-4">
            {filename}
          </h3>
          <div className="flex items-center space-x-2 shrink-0">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors flex items-center space-x-1"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Open</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Close</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-4">
          {isImage ? (
            <img 
              src={url} 
              alt={filename}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          ) : (
            <iframe 
              src={url} 
              title={filename}
              className="w-full h-full rounded-lg bg-white shadow-sm border border-slate-200"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
