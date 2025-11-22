
import React, { useState } from 'react';
import { Lightbulb, Zap, ArrowUpCircle, ArrowDownCircle, BarChart3, Check, Crown, ArrowRight, Sparkles, TrendingUp, BookOpen, X, Search, Info, ChevronDown, ChevronUp, HelpCircle, Activity } from 'lucide-react';
import { TrizAnalysis as TrizAnalysisType, SimilarPatent } from '../types';
import { TRIZ_DATA } from '../trizData';

interface TrizAnalysisProps {
  data: TrizAnalysisType;
  similarPatents?: SimilarPatent[];
}

const LEVEL_DEFINITIONS = [
  {
    level: 1,
    title: "Level 1: 명백한 해법 (Apparent Solution)",
    desc: "개인의 지식 범위 내에서 해결 가능한 문제. 모순이 없거나 단순한 타협을 통해 해결됩니다. (비중: 32%)",
    example: "단순한 치수 변경, 재질 변경 등 구조적 변화가 없는 개선."
  },
  {
    level: 2,
    title: "Level 2: 소발명 (Small Improvement)",
    desc: "산업 내의 지식을 활용하여 기존 시스템을 약간 수정함. 모순을 타협이 아닌 개선으로 해결합니다. (비중: 45%)",
    example: "핸들의 모양을 인체공학적으로 변경, 기존 기계의 속도 개선을 위한 부품 교체."
  },
  {
    level: 3,
    title: "Level 3: 근본적 발명 (Substantial Invention)",
    desc: "타 산업의 지식을 도입하여 시스템을 근본적으로 변화시킴. 심각한 모순을 완전히 해결합니다. (비중: 18%)",
    example: "내연기관에서 전기모터로의 전환, 기계식 시계에서 전자식 시계로의 변화."
  },
  {
    level: 4,
    title: "Level 4: 새로운 개념 (Breakthrough)",
    desc: "새로운 원리(과학)를 기술에 적용하여 새로운 패러다임을 창출합니다. (비중: 4%)",
    example: "형상기억합금의 이용, 레이저의 발명, 최초의 비행기."
  },
  {
    level: 5,
    title: "Level 5: 발견 (Discovery)",
    desc: "새로운 과학적 현상이나 물질의 발견. 알려지지 않았던 자연 법칙을 찾아냅니다. (비중: <1%)",
    example: "X-ray 발견, 페니실린 발견, 초전도체 현상 발견."
  }
];

const TrizAnalysis: React.FC<TrizAnalysisProps> = ({ 
  data,
  similarPatents
}) => {
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<number | null>(null);
  const [showLevelGuide, setShowLevelGuide] = useState(false);

  if (!data) return null;

  // Defensive checks
  const principles = Array.isArray(data.principles) ? data.principles : [];
  const inventionLevel = data.inventionLevel;
  const hasInventionLevel = inventionLevel && typeof inventionLevel.level === 'number';
  const lifecycle = data.technologyLifecycle;

  const levels = [
    { lvl: 1, label: 'Level 1', desc: '명백한 해법' },
    { lvl: 2, label: 'Level 2', desc: '소발명' },
    { lvl: 3, label: 'Level 3', desc: '근본적 발명' },
    { lvl: 4, label: 'Level 4', desc: '새로운 개념' },
    { lvl: 5, label: 'Level 5', desc: '발견' },
  ];

  const safeSimilarPatents = Array.isArray(similarPatents) ? similarPatents : [];
  
  const avgSimilarLevel = safeSimilarPatents.length > 0
    ? safeSimilarPatents.reduce((acc, curr) => acc + (Number(curr.inventionLevel) || 1), 0) / safeSimilarPatents.length
    : 0;

  const getLevelColor = (level: number = 1) => {
    if (level <= 2) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (level === 3) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };
  
  const getLevelBarColor = (level: number = 1) => {
    if (level <= 2) return 'bg-emerald-500';
    if (level === 3) return 'bg-amber-500';
    return 'bg-purple-500';
  };

  const getComparisonResult = () => {
    if (!hasInventionLevel || !inventionLevel) {
        return { text: "", color: "", icon: null };
    }
    
    const diff = inventionLevel.level - avgSimilarLevel;
    if (diff >= 0.5) return { text: "업계 평균 상회 (Above Average)", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: <ArrowUpCircle className="w-4 h-4" /> };
    if (diff <= -0.5) return { text: "업계 평균 하회 (Below Average)", color: "text-rose-600 bg-rose-50 border-rose-200", icon: <ArrowDownCircle className="w-4 h-4" /> };
    return { text: "업계 평균 수준 (Average)", color: "text-slate-600 bg-slate-50 border-slate-200", icon: <Check className="w-4 h-4" /> };
  };

  const comparison = getComparisonResult();
  const selectedPrincipleData = selectedPrincipleId ? principles.find(p => p.number === selectedPrincipleId) : null;
  const selectedStaticData = selectedPrincipleId && TRIZ_DATA ? TRIZ_DATA[selectedPrincipleId] : null;

  // Lifecycle positioning helper
  const getLifecyclePosition = (stage: string) => {
    switch(stage) {
        case 'Infancy': return { left: '15%', label: '도입기' };
        case 'Growth': return { left: '40%', label: '성장기' };
        case 'Maturity': return { left: '70%', label: '성숙기' };
        case 'Decline': return { left: '90%', label: '쇠퇴기' };
        default: return { left: '50%', label: '분석 중' };
    }
  };

  const lifecyclePos = lifecycle ? getLifecyclePosition(lifecycle.stage) : { left: '0%', label: '' };

  return (
    <div className="space-y-6">
      {/* Core Solution Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm relative overflow-hidden animate-fade-in-up">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-4">
             <div className="bg-blue-100 p-1.5 rounded-lg">
               <Sparkles className="w-5 h-5 text-blue-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">핵심 발명 개념 (Core Inventive Concept)</h3>
           </div>
           
           <div className="bg-white/60 rounded-xl p-4 mb-5 border border-blue-100 backdrop-blur-sm">
             <p className="text-lg font-medium text-slate-800 leading-relaxed">
               {data.resolutionAbstract || '분석된 해결 개념이 없습니다.'}
             </p>
           </div>

           <div className="flex flex-wrap gap-2 items-center">
             <span className="text-sm font-semibold text-slate-500 mr-2">적용된 원리:</span>
             {principles.length > 0 ? principles.map((p) => (
               <button
                 key={p.number} 
                 onClick={() => setSelectedPrincipleId(p.number)}
                 className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-sm font-semibold text-blue-700 flex items-center gap-1.5 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all"
               >
                 <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{p.number}</span>
                 {p.name}
               </button>
             )) : <span className="text-sm text-slate-400">감지된 원리 없음</span>}
           </div>
        </div>
      </div>

      {/* Invention Level Section - Safe Render */}
      {hasInventionLevel && inventionLevel && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <BarChart3 className="w-5 h-5 text-purple-500" />
               <div>
                 <h3 className="font-bold text-slate-800">발명 수준 분석 (Level of Invention)</h3>
                 <p className="text-xs text-slate-500">Genrich Altshuller의 5수준 분류</p>
               </div>
             </div>
             <button 
               onClick={() => setShowLevelGuide(!showLevelGuide)}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
             >
               <Info className="w-3.5 h-3.5" />
               {showLevelGuide ? '가이드 숨기기' : '5수준 기준 보기'}
               {showLevelGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
             </button>
           </div>

          <div className="p-6">
            {/* Detailed Level Guide - Collapsible */}
            {showLevelGuide && (
              <div className="mb-8 bg-slate-50 rounded-xl p-4 border border-slate-200 animate-fade-in-up">
                 <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-700">알트슐러의 발명 5수준 정의</span>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                    {LEVEL_DEFINITIONS.map((def) => (
                      <div 
                        key={def.level} 
                        className={`p-3 rounded-lg border transition-all ${
                          inventionLevel.level === def.level 
                          ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200 shadow-sm' 
                          : 'bg-white border-slate-100 opacity-80 hover:opacity-100'
                        }`}
                      >
                         <div className="flex items-center justify-between mb-1">
                           <div className={`font-bold text-sm ${inventionLevel.level === def.level ? 'text-purple-800' : 'text-slate-700'}`}>
                             {def.title}
                           </div>
                           {inventionLevel.level === def.level && (
                             <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">Current</span>
                           )}
                         </div>
                         <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{def.desc}</p>
                         <p className="text-[10px] text-slate-400 bg-slate-50 inline-block px-1.5 py-0.5 rounded">
                           예: {def.example}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            <div className="flex justify-between items-end mb-2 relative">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
               
               <div 
                 className="absolute top-1/2 left-0 h-1 bg-purple-200 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000"
                 style={{ width: `${Math.max(0, Math.min(100, ((inventionLevel.level - 1) / 4) * 100))}%` }}
               ></div>

               {levels.map((l) => {
                 const isActive = l.lvl <= (inventionLevel.level || 1);
                 const isCurrent = l.lvl === inventionLevel.level;
                 
                 return (
                   <div key={l.lvl} className="flex flex-col items-center gap-2 cursor-default group">
                     <div className={`
                       w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500
                       ${isActive ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-300'}
                       ${isCurrent ? 'scale-125 shadow-lg ring-4 ring-purple-100' : ''}
                     `}>
                       {isCurrent ? <Crown className="w-4 h-4" /> : l.lvl}
                     </div>
                     <div className={`text-xs font-medium transition-colors ${isCurrent ? 'text-purple-700 font-bold' : 'text-slate-400'}`}>
                       {l.label}
                     </div>
                   </div>
                 );
               })}
            </div>
            
            <div className="mt-6 bg-purple-50 rounded-xl p-5 border border-purple-100 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-purple-200 p-1.5 rounded-full">
                   <Check className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="text-lg font-bold text-purple-900">{inventionLevel.name}</h4>
                    <span className="text-sm font-semibold text-purple-600">(Level {inventionLevel.level})</span>
                  </div>
                  <p className="text-sm text-purple-800 mb-3 font-medium">
                    {inventionLevel.description}
                  </p>
                  <div className="bg-white/60 p-3 rounded-lg border border-purple-100/50">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-purple-700 mr-1">평가 근거:</span>
                      {inventionLevel.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Comparison Chart */}
            {avgSimilarLevel > 0 && comparison.icon && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-slate-500" />
                     유사 특허 비교 (Industry Benchmark)
                   </h4>
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${comparison.color}`}>
                     {comparison.icon}
                     {comparison.text}
                   </div>
                 </div>
                 
                 <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-6 relative">
                    {/* Background grid lines for visual scale */}
                    <div className="absolute inset-x-6 top-6 bottom-6 flex justify-between pointer-events-none opacity-10">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-px h-full bg-slate-900"></div>
                      ))}
                    </div>

                    {/* Current Patent Bar - Stacked */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" /> 현재 특허 (Current)
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">Level {inventionLevel.level}</span>
                      </div>
                      <div className="h-6 w-full bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/50">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 relative shadow-sm flex items-center justify-end pr-2"
                          style={{ width: `${(inventionLevel.level / 5) * 100}%` }}
                        >
                           <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Average Bar - Stacked */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5" /> 유사 특허 평균 (Market Avg)
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">Level {avgSimilarLevel.toFixed(1)}</span>
                      </div>
                      <div className="h-6 w-full bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/50">
                        <div 
                          className="h-full bg-slate-400 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                          style={{ width: `${(avgSimilarLevel / 5) * 100}%` }}
                        >
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between px-0 text-[10px] text-slate-400 font-mono pt-1">
                      <span>L1</span>
                      <span>L2</span>
                      <span>L3</span>
                      <span>L4</span>
                      <span>L5</span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technology Lifecycle S-Curve Visualization */}
      {lifecycle && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
           <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
             <Activity className="w-5 h-5 text-cyan-600" />
             <div>
               <h3 className="text-lg font-bold text-slate-800">기술 수명 주기 (Technology Lifecycle)</h3>
               <p className="text-xs text-slate-500">TRIZ 발명 수준 및 적용 원리에 기반한 추론</p>
             </div>
           </div>

           <div className="p-6">
             <div className="relative h-48 mb-6 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                {/* S-Curve SVG */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path 
                    d="M 0 90 C 40 90, 40 10, 100 10" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="4"
                  />
                  <path 
                    d="M 0 90 C 40 90, 40 10, 100 10" 
                    fill="none" 
                    stroke="url(#gradient-curve)" 
                    strokeWidth="4"
                    strokeDasharray="200"
                    className="animate-[dash_2s_ease-out_forwards]"
                  />
                  <defs>
                    <linearGradient id="gradient-curve" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Labels */}
                <div className="absolute bottom-2 left-2 text-[10px] font-bold text-slate-400">Time</div>
                <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400">Performance</div>

                {/* Zones */}
                <div className="absolute inset-0 flex text-[10px] font-bold text-slate-300 pointer-events-none">
                   <div className="w-[25%] border-r border-slate-200/50 h-full flex items-end justify-center pb-1">도입기</div>
                   <div className="w-[35%] border-r border-slate-200/50 h-full flex items-end justify-center pb-1">성장기</div>
                   <div className="w-[25%] border-r border-slate-200/50 h-full flex items-end justify-center pb-1">성숙기</div>
                   <div className="w-[15%] h-full flex items-end justify-center pb-1">쇠퇴기</div>
                </div>

                {/* Current Position Marker */}
                <div 
                  className="absolute top-1/2 w-0.5 h-full bg-cyan-500/30 border-l border-cyan-500 border-dashed transform -translate-y-1/2 transition-all duration-1000 ease-out"
                  style={{ left: lifecyclePos.left }}
                ></div>
                <div 
                  className="absolute top-[30%] w-auto transform -translate-x-1/2 transition-all duration-1000 ease-out flex flex-col items-center z-10"
                  style={{ left: lifecyclePos.left }}
                >
                  <div className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap mb-1">
                    {lifecyclePos.label} ({lifecycle.stage})
                  </div>
                  <div className="w-4 h-4 bg-cyan-600 rounded-full ring-4 ring-cyan-100 animate-pulse"></div>
                </div>
             </div>

             <div className="bg-cyan-50 p-5 rounded-xl border border-cyan-100">
               <h4 className="text-sm font-bold text-cyan-800 mb-2">{lifecycle.stageName} 단계의 특징 및 분석 근거</h4>
               <p className="text-sm text-slate-700 leading-relaxed mb-3">{lifecycle.description}</p>
               <div className="bg-white/60 p-3 rounded-lg border border-cyan-100/50 text-xs text-slate-600">
                  <span className="font-bold text-cyan-700 mr-1">Reasoning:</span>
                  {lifecycle.reasoning}
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Contradiction Resolution Infographic */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>

        <div className="flex items-center gap-2 mb-8 relative z-10">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold">모순 극복 메커니즘 (Contradiction Resolution)</h3>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex-1 w-full md:w-auto flex flex-col gap-2">
             <div className="bg-white/10 border border-white/10 rounded-xl p-4 relative group hover:bg-white/15 transition-colors">
               <div className="absolute -top-3 left-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Conflict</div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <ArrowUpCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">{data.improvingFeature || 'N/A'}</span>
                    </div>
                 </div>
                 <div className="h-px bg-white/20 w-full"></div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-300">
                      <ArrowDownCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">{data.worseningFeature || 'N/A'}</span>
                    </div>
                 </div>
               </div>
             </div>
             <div className="text-xs text-slate-400 px-1 line-clamp-2">
                {data.contradiction || 'No contradiction data available.'}
             </div>
          </div>

          <div className="flex flex-col items-center justify-center px-2 md:px-6 py-4 md:py-0">
             <div className="flex items-center gap-1">
                <div className="h-0.5 w-8 md:w-12 bg-gradient-to-r from-white/20 to-amber-400/50"></div>
                <div className="bg-amber-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-amber-500/20 z-20 ring-4 ring-slate-800">
                  {principles.length}
                </div>
                <div className="h-0.5 w-8 md:w-12 bg-gradient-to-r from-amber-400/50 to-blue-500/50"></div>
             </div>
             <span className="text-[10px] text-amber-400 font-bold mt-2 uppercase tracking-wider">발명 원리 적용</span>
          </div>

          <div className="flex-1 w-full md:w-auto flex flex-col gap-2">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/30 rounded-xl p-4 relative h-full flex flex-col justify-center">
               <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                 <Sparkles className="w-3 h-3" /> Solution
               </div>
               <p className="text-base font-medium text-blue-50 leading-relaxed">
                 {data.resolutionAbstract || "원리가 적용되어 모순이 해결되었습니다."}
               </p>
            </div>
            <div className="text-xs text-slate-400 px-1">
                모순 해결 추상화
             </div>
          </div>
        </div>
      </div>

      {/* Inventive Principles Detail List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-800">적용된 40가지 발명 원리</h3>
              <p className="text-xs text-slate-500">카드를 클릭하여 상세 이론과 실제 적용 사례를 확인하세요.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {principles.map((principle) => (
            <div 
              key={principle.number} 
              onClick={() => setSelectedPrincipleId(principle.number)}
              className="group relative bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 cursor-pointer overflow-hidden"
            >
              {/* Visual Indicator Bar on Left Side */}
              {principle.level && (
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getLevelBarColor(principle.level)}`}></div>
              )}

              <div className="absolute -right-4 -bottom-4 text-slate-50 font-black text-6xl group-hover:text-amber-50 transition-colors">
                {principle.number}
              </div>
              
              <div className="relative z-10 pl-2">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                        원리 {principle.number}
                      </span>
                      <h4 className="font-bold text-slate-800">{principle.name}</h4>
                   </div>
                   
                   {principle.level && (
                     <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-bold ${getLevelColor(principle.level)}`}>
                        <span>L{principle.level}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                             <div 
                               key={i} 
                               className={`w-0.5 h-2 rounded-full ${i <= (principle.level || 1) ? getLevelBarColor(principle.level || 1) : 'bg-slate-200'}`}
                             />
                          ))}
                        </div>
                     </div>
                   )}
                </div>

                <div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2 group-hover:text-slate-800">
                    {principle.application}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    상세 보기 <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPrincipleId && selectedPrincipleData && selectedStaticData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-200">
                    {selectedPrincipleData.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h2 className="text-xl font-bold text-slate-800">{selectedPrincipleData.name}</h2>
                       {selectedPrincipleData.level && (
                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${getLevelColor(selectedPrincipleData.level)}`}>
                           Level {selectedPrincipleData.level}
                         </span>
                       )}
                    </div>
                    <p className="text-slate-500 text-sm">TRIZ 40가지 발명 원리 중 하나</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPrincipleId(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col md:flex-row gap-8">
                  
                  <div className="flex-1 space-y-6">
                     <div>
                       <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase mb-3">
                         <BookOpen className="w-4 h-4 text-blue-500" />
                         원리 정의 (Theory)
                       </h3>
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-slate-700 leading-relaxed text-sm">
                         {selectedStaticData.definition}
                       </div>
                     </div>

                     <div>
                       <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase mb-3">
                         <Search className="w-4 h-4 text-indigo-500" />
                         일반적 적용 예시
                       </h3>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-sm">
                         {selectedStaticData.example}
                       </div>
                     </div>
                  </div>

                  <div className="hidden md:block w-px bg-slate-200 self-stretch"></div>

                  <div className="flex-1 flex flex-col">
                     {/* Contradiction Context Map */}
                     <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase mb-3">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          해결된 모순 (Context)
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                           <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                                 </div>
                                 <div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Improving Feature</span>
                                    <span className="text-xs font-bold text-slate-700">{data.improvingFeature}</span>
                                 </div>
                              </div>
                              
                              <div className="pl-4 flex my-[-4px]">
                                 <div className="w-0.5 h-4 bg-slate-300"></div>
                              </div>

                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <ArrowDownCircle className="w-5 h-5 text-rose-600" />
                                 </div>
                                 <div>
                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Worsening Feature</span>
                                    <span className="text-xs font-bold text-slate-700">{data.worseningFeature}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-center -my-3 relative z-10">
                           <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full border border-white shadow-sm">
                              Resolves via
                           </div>
                        </div>
                     </div>

                     <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase mb-3">
                       <Lightbulb className="w-4 h-4 text-amber-500" />
                       이 특허에서의 적용 (Application)
                     </h3>
                     <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 flex-1">
                       <p className="text-slate-800 font-medium leading-7">
                         {selectedPrincipleData.application}
                       </p>
                       
                       <div className="mt-6 pt-6 border-t border-amber-100/50">
                         <span className="text-xs font-bold text-amber-700 block mb-2">AI 분석 코멘트</span>
                         <p className="text-xs text-amber-800/80 leading-relaxed">
                           {selectedPrincipleData.description}
                         </p>
                       </div>
                     </div>
                  </div>

                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setSelectedPrincipleId(null)}
                  className="px-5 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrizAnalysis;