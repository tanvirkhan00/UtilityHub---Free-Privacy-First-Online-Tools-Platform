import React, { useRef, useState } from 'react';
import { UploadCloud, File, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = '*/*',
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  title = 'Drag and drop your file here, or browse',
  subtitle,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPass = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndPass(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
            : isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-4 ring-indigo-500/10 scale-[1.005]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/70 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => validateAndPass(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-transform group-hover:scale-110">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {subtitle || `Supports ${accept.replace(/\*/g, 'all')} up to ${maxSizeMB}MB`}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors pointer-events-none">
            Choose File{multiple ? 's' : ''}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto p-1 text-rose-500 hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
