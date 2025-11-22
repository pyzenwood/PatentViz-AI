
import React from 'react';
import { 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Quote, 
  Fingerprint, 
  Hash, 
  ArrowRight, 
  Target,
} from 'lucide-react';
import { PatentEssence } from '../types';

interface PatentEssenceInfographicProps {
  data?: PatentEssence;
}

const PatentEssenceInfographic: React.FC<PatentEssenceInfographicProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden text-white ring-1 ring-slate-800 relative isolate animate-fade-in-up">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Header */}
      <div className="px-8 py-8 border-b border-white/10 bg-white/5 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Patent Essence</h2>
            <p className="text-slate-400 text-sm font-medium">특허 핵심 가치 구조화 분석</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 max-w-lg justify-end">
          {data.keywordTags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-blue-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5">
              <Hash className="w-3 h-3 opacity-70" />
              {tag.replace(/#/g, '')}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Connecting Arrows (Desktop Only) */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[32%] right-[32%] z-0 pointer-events-none">
             <div className="w-full h-0.5 bg-gradient-to-r from-rose-500/30 via-blue-500/30 to-emerald-500/30"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-1 rounded-full border border-white/10">
               <ArrowRight className="w-5 h-5 text-slate-500" />
             </div>
          </div>

          {/* 1. Problem (Pain Point) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full"></div>
                  <div className="w-14 h-14 rounded-full bg-slate-800 border border-rose-500/30 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900 shadow-sm">01</div>
                </div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest border border-rose-500/30 px-3 py-1 rounded-full bg-rose-500/10">
                  Pain Point
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                해결하려는 문제
              </h3>
              
              <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-white/5 text-slate-300 text-sm leading-relaxed font-light">
                {data.problem}
              </div>
            </div>
          </div>

          {/* 2. Solution (Innovation) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                  <div className="w-14 h-14 rounded-full bg-slate-800 border border-blue-500/30 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-7 h-7 text-blue-500" />
                  </div>
                   <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900 shadow-sm">02</div>
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/10">
                  Solution
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                핵심 해결 수단
              </h3>
              
              <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-white/5 text-slate-300 text-sm leading-relaxed font-light">
                {data.solution}
              </div>
            </div>
          </div>

          {/* 3. Benefit (Value) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full"></div>
                  <div className="w-14 h-14 rounded-full bg-slate-800 border border-emerald-500/30 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-7 h-7 text-emerald-500" />
                  </div>
                   <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900 shadow-sm">03</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">
                  Benefit
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                제공 가치 및 효과
              </h3>
              
              <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-white/5 text-slate-300 text-sm leading-relaxed font-light">
                {data.benefit}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Analogy & Depth */}
      <div className="border-t border-white/10 bg-black/20 p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Analogy Box */}
          <div className="flex-1 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-1 border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div className="p-5 flex gap-5 items-start relative z-10">
              <div className="shrink-0">
                 <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 shadow-sm">
                    <Quote className="w-5 h-5 text-indigo-400" />
                 </div>
              </div>
              <div className="space-y-2">
                 <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Analogy (쉬운 비유)</h4>
                 <p className="text-lg text-white font-medium italic leading-relaxed font-serif opacity-90">
                   "{data.analogy}"
                 </p>
              </div>
            </div>
          </div>

          {/* Technical Depth Box */}
          <div className="lg:w-64 bg-slate-800/50 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors group">
             <div className="mb-3 p-2 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                <Target className="w-6 h-6 text-purple-400" />
             </div>
             <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">기술 난이도</span>
             <div className="text-xl font-bold text-white">
                {data.technicalDepth}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatentEssenceInfographic;
