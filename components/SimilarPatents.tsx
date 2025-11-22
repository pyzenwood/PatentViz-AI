import React from 'react';
import { Search, ExternalLink, Building2, BarChart3, Crown, TrendingUp, Sparkles } from 'lucide-react';
import { SimilarPatent } from '../types';

interface SimilarPatentsProps {
  patents: SimilarPatent[];
  currentInventionLevel?: number;
  onAnalyzeSimilar: (patentNumber: string) => void;
}

const SimilarPatents: React.FC<SimilarPatentsProps> = ({ patents, currentInventionLevel, onAnalyzeSimilar }) => {
  if (!patents || patents.length === 0) return null;

  // Calculate Average Level with safety check for string/number
  const validPatents = patents.filter(p => p.inventionLevel !== undefined && p.inventionLevel !== null);
  const avgLevel = validPatents.length > 0
    ? validPatents.reduce((sum, p) => sum + (Number(p.inventionLevel) || 0), 0) / validPatents.length
    : 0;
  
  const hasComparison = typeof currentInventionLevel === 'number';
  const currentLevel = Number(currentInventionLevel) || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">유사 특허 검색 & 비교</h3>
            <p className="text-slate-500 text-xs">Google Patents 기반 유사 기술 분석</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
          Top {patents.length}
        </span>
      </div>

      {/* Comparison Chart Section */}
      {hasComparison && avgLevel > 0 && (
        <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <h4 className="text-sm font-bold text-slate-700">발명 수준 비교 (Invention Level)</h4>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex flex-col gap-6">
                    {/* Current Patent */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-blue-700 flex items-center gap-1.5">
                                <Crown className="w-4 h-4" /> 
                                현재 특허 (Current)
                            </span>
                            <span className="font-mono font-bold text-blue-700">Level {currentLevel}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-600 rounded-full relative shadow-sm"
                                style={{ width: `${(Math.min(currentLevel, 5) / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Average */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                             <span className="font-bold text-slate-600 flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4" /> 
                                유사 특허 평균 (Market Avg)
                            </span>
                            <span className="font-mono font-bold text-slate-600">Level {avgLevel.toFixed(1)}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-slate-400 rounded-full"
                                style={{ width: `${(Math.min(avgLevel, 5) / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-200/50 flex justify-end">
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm ${
                        currentLevel > avgLevel 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : currentLevel < avgLevel
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        {currentLevel > avgLevel 
                            ? `분석 결과: 업계 평균보다 +${(currentLevel - avgLevel).toFixed(1)} 레벨 우위`
                            : currentLevel < avgLevel
                            ? `분석 결과: 업계 평균보다 ${(avgLevel - currentLevel).toFixed(1)} 레벨 낮음`
                            : '분석 결과: 업계 평균과 동일한 수준'
                        }
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600 whitespace-nowrap w-32">특허 번호</th>
              <th className="px-6 py-3 font-semibold text-slate-600">발명의 명칭</th>
              <th className="px-6 py-3 font-semibold text-slate-600 w-48">출원인 (Assignee)</th>
              <th className="px-6 py-3 font-semibold text-slate-600 w-24 text-center">링크</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patents.map((patent, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                  <button 
                    onClick={() => onAnalyzeSimilar(patent.patentNumber)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all text-blue-600 font-bold"
                    title="이 특허로 새 분석 시작"
                  >
                    <Sparkles className="w-3 h-3" />
                    {patent.patentNumber}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{patent.title}</div>
                  <div className="flex items-center gap-2 mb-1">
                    {patent.inventionLevel !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        Number(patent.inventionLevel) >= 3 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        Level {patent.inventionLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{patent.summary}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span className="line-clamp-1">{patent.assignee}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <a 
                    href={`https://patents.google.com/patent/${patent.patentNumber.replace(/\s/g,'')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-all"
                    title="Google Patents에서 보기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimilarPatents;