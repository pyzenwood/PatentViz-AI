
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Download, Sparkles, Wand2, X, ZoomIn, Copy, Check } from 'lucide-react';

interface PrototypeViewerProps {
  imageUrl: string | null;
  prompt: string;
  isLoading: boolean;
  isEditing: boolean;
  onEdit: (prompt: string) => void;
}

const PrototypeViewer: React.FC<PrototypeViewerProps> = ({ imageUrl, prompt, isLoading, isEditing, onEdit }) => {
  const [editInput, setEditInput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Lock body scroll when full screen
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editInput.trim()) {
      onEdit(editInput);
      setEditInput('');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] -skew-x-12"></div>
        <Sparkles className="w-10 h-10 text-blue-400 animate-pulse mb-4" />
        <p className="text-slate-500 font-medium z-10">프로토타입 시각화 생성 중...</p>
        <p className="text-slate-400 text-xs mt-2 z-10">Powered by Gemini 2.5 Flash Image</p>
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <>
      <div className="group relative w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-black/70 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" /> AI 생성 프로토타입
          </span>
        </div>
        
        <div 
          className="relative aspect-[4/3] w-full bg-slate-50 cursor-pointer overflow-hidden"
          onClick={() => setIsFullScreen(true)}
        >
          <img 
            src={imageUrl} 
            alt="AI Generated Prototype" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          
          {/* Hover Overlay for Zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 shadow-xl">
               <ZoomIn className="w-4 h-4" /> 크게 보기
             </div>
          </div>
          
          {/* Editing Overlay */}
          {isEditing && (
            <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center animate-fade-in-up cursor-default" onClick={(e) => e.stopPropagation()}>
              <Wand2 className="w-10 h-10 text-blue-600 animate-pulse mb-3" />
              <p className="text-slate-700 font-bold">프로토타입 수정 중...</p>
              <p className="text-slate-500 text-sm">잠시만 기다려주세요</p>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-800">시각적 표현 (프롬프트)</h3>
            <button 
              onClick={handleCopyPrompt}
              className={`
                flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all
                ${isCopied 
                  ? 'bg-green-50 text-green-600 border border-green-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}
              `}
              title="프롬프트 복사"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  복사
                </>
              )}
            </button>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 max-h-32 overflow-y-auto custom-scrollbar">
            <p className="text-sm text-slate-600 italic whitespace-pre-wrap leading-relaxed break-words font-mono">
              "{prompt}"
            </p>
          </div>
          
          <div className="flex gap-2 mb-4">
             <button 
               onClick={() => setIsFullScreen(true)}
               className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
               disabled={isEditing}
             >
               <Maximize2 className="w-4 h-4" /> 전체 보기
             </button>
             <a 
               href={imageUrl} 
               download="patent-prototype.png"
               className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md ${isEditing ? 'pointer-events-none opacity-50' : ''}`}
             >
               <Download className="w-4 h-4" /> 다운로드
             </a>
          </div>

          {/* Edit Form */}
          <div className="pt-4 border-t border-slate-100">
            <form onSubmit={handleEditSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Wand2 className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  placeholder="수정사항 입력 (예: 배경을 파란색으로, 둥글게)"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={isEditing}
                />
              </div>
              <button 
                type="submit"
                disabled={isEditing || !editInput.trim()}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shadow-sm"
              >
                수정
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Full Screen Modal - Portal to document.body to avoid stacking context issues */}
      {isFullScreen && imageUrl && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-fade-in-up">
           {/* Header with Close Button */}
           <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-50">
             <button 
               onClick={() => setIsFullScreen(false)}
               className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all backdrop-blur-none border border-white/20"
             >
               <X className="w-6 h-6" />
             </button>
           </div>

           {/* Main Image Container */}
           <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden" onClick={() => setIsFullScreen(false)}>
             <img 
               src={imageUrl} 
               alt="Full Screen Prototype" 
               className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
               onClick={(e) => e.stopPropagation()}
             />
           </div>

           {/* Footer Caption */}
           <div className="bg-slate-900/90 text-white p-6 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-4xl mx-auto text-center">
                 <p className="text-sm md:text-base font-medium text-slate-200">"{prompt}"</p>
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PrototypeViewer;
