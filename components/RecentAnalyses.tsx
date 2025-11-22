
import React from 'react';
import { Clock, ArrowRight, Trash2, FileText, Image as ImageIcon, Calendar } from 'lucide-react';
import { HistoryItem } from '../types';

interface RecentAnalysesProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ items, onSelect, onClear, onDelete }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">최근 분석 기록</h3>
            <p className="text-xs text-slate-500">이전에 분석한 특허를 다시 확인하세요</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> 전체 삭제
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          // Extra safety check inside map
          if (!item || !item.patentData) return null;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex gap-4 mb-3">
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100 shadow-inner relative">
                  {item.prototypeImageUrl ? (
                    <img src={item.prototypeImageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[8px]">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-1.5 mb-1">
                     <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">
                       {item.patentData.patentNumber || 'PATENT'}
                     </span>
                   </div>
                   <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors">
                     {item.patentData.title || 'Untitled Patent'}
                   </h4>
                   <div className="flex items-center gap-1 text-[10px] text-slate-400">
                     <Calendar className="w-3 h-3" />
                     {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                   <FileText className="w-3.5 h-3.5" />
                   <span className="truncate max-w-[150px]">{item.fileName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                   <button 
                      onClick={(e) => onDelete(item.id, e)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="삭제"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                   <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <ArrowRight className="w-3 h-3" />
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAnalyses;
