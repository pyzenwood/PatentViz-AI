
import React, { useState, useMemo, useEffect } from 'react';
import { GitCommit, ArrowRight, Info, FileText, CornerDownRight, Bookmark } from 'lucide-react';
import { PatentClaim } from '../types';

interface ClaimsInfographicProps {
  claims: PatentClaim[];
}

const ClaimsInfographic: React.FC<ClaimsInfographicProps> = ({ claims }) => {
  const [selectedClaim, setSelectedClaim] = useState<PatentClaim | null>(null);

  // Defensive check: Ensure claims is an array
  const safeClaims = Array.isArray(claims) ? claims : [];

  // Organize claims into a hierarchy for visualization
  const independentClaims = useMemo(() => 
    safeClaims.filter(c => c.type === 'independent'), 
  [safeClaims]);

  const getDependentClaims = (parentId: number) => 
    safeClaims.filter(c => c.dependencyRef === parentId);

  // Auto-select the first independent claim so details are visible by default
  useEffect(() => {
    if (safeClaims.length > 0 && !selectedClaim) {
      const firstIndependent = safeClaims.find(c => c.type === 'independent');
      setSelectedClaim(firstIndependent || safeClaims[0]);
    }
  }, [safeClaims, selectedClaim]);

  // If no claims are present, do not render the component
  if (safeClaims.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <Info className="w-10 h-10 mx-auto mb-2 opacity-20" />
        <p>표시할 청구항 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">청구항 구조 인포그래픽</h3>
          <p className="text-slate-500 text-sm">상호작용 가능한 종속성 맵</p>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-slate-600">독립항</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-slate-600">종속항</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Visualization Tree */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 relative custom-scrollbar">
          <div className="space-y-8 relative z-10">
            {independentClaims.map((indClaim) => {
              const dependents = getDependentClaims(indClaim.number);
              const hasDependents = dependents.length > 0;

              return (
                <div key={indClaim.id} className="relative">
                  {/* Independent Claim Node */}
                  <div 
                    onClick={() => setSelectedClaim(indClaim)}
                    className={`
                      relative flex items-start gap-4 group cursor-pointer transition-all duration-200 z-20
                      ${selectedClaim?.id === indClaim.id ? 'translate-x-2' : ''}
                    `}
                  >
                    <div className={`
                      mt-1 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors relative bg-white
                      ${selectedClaim?.id === indClaim.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' 
                        : 'border-blue-600 text-blue-600 group-hover:bg-blue-50'}
                    `}>
                      <span className="text-sm font-bold">{indClaim.number}</span>
                      {/* Small dot at bottom if has dependents to signify connection source */}
                      {hasDependents && (
                         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className={`
                      flex-1 p-3.5 rounded-xl border transition-all
                      ${selectedClaim?.id === indClaim.id 
                        ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200' 
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}
                    `}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                          독립항
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2 font-medium">
                        {indClaim.conciseExplanation || indClaim.explanation || indClaim.text}
                      </p>
                    </div>
                  </div>

                  {/* Dependent Claims Tree Structure */}
                  {hasDependents && (
                    <div className="relative mt-2">
                      {/* Main Vertical Stem Line - connected to Independent Claim */}
                      <div className="absolute left-[1.125rem] top-[-0.5rem] bottom-6 w-0.5 bg-slate-300/60 rounded-full"></div>

                      <div className="pl-12 pt-3 space-y-3">
                        {dependents.map((depClaim, idx) => {
                          const isLast = idx === dependents.length - 1;
                          return (
                            <div 
                              key={depClaim.id}
                              onClick={() => setSelectedClaim(depClaim)}
                              className={`
                                relative flex items-center gap-3 group cursor-pointer transition-transform duration-200
                                ${selectedClaim?.id === depClaim.id ? 'translate-x-1' : ''}
                              `}
                            >
                               {/* Horizontal Branch Connector */}
                               <div className="absolute -left-[30px] top-1/2 w-[30px] h-0.5 bg-slate-300/60 rounded-r-full"></div>

                               {/* Arrow Head */}
                               <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 text-slate-300/80">
                                 <ArrowRight className="w-3 h-3" />
                               </div>

                               {/* White patch to hide vertical line for the last item */}
                               {isLast && (
                                  <div className="absolute -left-[32px] top-1/2 translate-y-0.5 bottom-[-20px] w-2 bg-slate-50/30 backdrop-blur-xl"></div>
                               )}

                               <div className={`
                                 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border z-10 transition-colors
                                 ${selectedClaim?.id === depClaim.id 
                                   ? 'bg-indigo-50 border-indigo-500 text-white shadow-sm' 
                                   : 'bg-white border-indigo-300 text-indigo-500 group-hover:bg-indigo-50'}
                               `}>
                                 <span className="text-xs font-bold">{depClaim.number}</span>
                               </div>

                               <div className={`
                                 flex-1 p-2.5 rounded-lg border transition-all relative
                                 ${selectedClaim?.id === depClaim.id 
                                   ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                   : 'bg-white border-slate-200 hover:border-indigo-200'}
                               `}>
                                 {/* Connection triangle */}
                                 {selectedClaim?.id === depClaim.id && (
                                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-50 border-l border-b border-indigo-200 rotate-45 transform"></div>
                                 )}
                                 <p className="text-xs text-slate-600 line-clamp-1">
                                   {depClaim.conciseExplanation || depClaim.explanation || depClaim.text}
                                 </p>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 overflow-y-auto h-64 md:h-auto">
          {selectedClaim ? (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0
                  ${selectedClaim.type === 'independent' ? 'bg-blue-600' : 'bg-indigo-500'}
                `}>
                  {selectedClaim.number}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">청구항 {selectedClaim.number}</h4>
                  <span className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                    {selectedClaim.type === 'independent' ? '독립항' : '종속항'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Concise Explanation Headline */}
                {selectedClaim.conciseExplanation && (
                  <div className="mb-2">
                     <h5 className="text-lg font-bold text-slate-800 leading-tight">
                        {selectedClaim.conciseExplanation}
                     </h5>
                  </div>
                )}

                {/* Detailed Explanation */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> 쉬운 설명 (Detail)
                  </h5>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedClaim.explanation || "설명이 없습니다."}
                  </p>
                </div>

                {/* Original Text */}
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                     <FileText className="w-3 h-3" /> 원문 (법적 텍스트)
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-mono bg-slate-50 p-3 rounded border border-slate-100">
                    {selectedClaim.text}
                  </p>
                </div>

                {selectedClaim.type === 'dependent' && selectedClaim.dependencyRef && (
                   <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                      <CornerDownRight className="w-4 h-4" />
                      <span>청구항 {selectedClaim.dependencyRef}에 종속됨</span>
                   </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
              <GitCommit className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">상세 내용을 보려면 청구항 노드를 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimsInfographic;
