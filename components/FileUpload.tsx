import React, { useCallback } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, isProcessing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
        ${isProcessing 
          ? 'border-slate-200 bg-slate-50 cursor-not-allowed' 
          : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer'
        }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="application/pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleChange}
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isProcessing ? 'bg-slate-100' : 'bg-blue-100 text-blue-600'}`}>
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800">
            {isProcessing ? '특허 처리 중...' : '특허 PDF 업로드'}
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {isProcessing 
              ? '문서 구조를 분석하는 동안 잠시만 기다려주세요.' 
              : 'PDF를 이곳에 드래그 앤 드롭하거나 클릭하여 업로드하세요.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
