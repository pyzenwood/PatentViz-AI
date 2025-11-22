
import React from 'react';
import { Sparkles, ShieldCheck, Quote, Target, ArrowRight, Check, AlertCircle, Lightbulb } from 'lucide-react';
import { PatentEssence, PatentClaim } from '../types';

interface ExecutiveSummaryProps {
  summary: string;
  essence: PatentEssence;
  claims: PatentClaim[];
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary, essence, claims }) => {
  // Filter for independent claims to show high-level scope
  const independentClaims = claims ? claims.filter(c => c.type === 'independent') : [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-800">경영진 요약 (Executive Summary)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Text Summary & Essence */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">발명 요약</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 text-justify whitespace-pre-wrap break-keep">
              {summary}
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">핵심 가치 (Core Value)</h3>
            <div className="flex flex-col gap-4">
               {/* Problem */}
               <div className="flex flex-col sm:flex-row sm:items-start gap-3 bg-rose-50 p-4 rounded-xl border border-rose-100 transition-all hover:shadow-sm">
                 <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2">
                   <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">Problem</span>
                   <div className="p-1.5 bg-white rounded-full border border-rose-100 text-rose-500 hidden sm:block">
                      <AlertCircle className="w-4 h-4" />
                   </div>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-keep break-words flex-1 min-w-0">
                   {essence.problem}
                 </p>
               </div>
               
               <div className="flex justify-center -my-2 z-10 relative opacity-50">
                  <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
               </div>

               {/* Solution */}
               <div className="flex flex-col sm:flex-row sm:items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 transition-all hover:shadow-sm">
                 <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2">
                   <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">Solution</span>
                   <div className="p-1.5 bg-white rounded-full border border-blue-100 text-blue-500 hidden sm:block">
                      <Lightbulb className="w-4 h-4" />
                   </div>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-keep break-words flex-1 min-w-0">
                   {essence.solution}
                 </p>
               </div>

               <div className="flex justify-center -my-2 z-10 relative opacity-50">
                  <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
               </div>

               {/* Benefit */}
               <div className="flex flex-col sm:flex-row sm:items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100 transition-all hover:shadow-sm">
                 <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2">
                   <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">Benefit</span>
                   <div className="p-1.5 bg-white rounded-full border border-emerald-100 text-emerald-500 hidden sm:block">
                      <Check className="w-4 h-4" />
                   </div>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-keep break-words flex-1 min-w-0">
                   {essence.benefit}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Claims & Analogy */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 주요 청구항 (Key Claims)
            </h3>
            <div className="space-y-3">
              {independentClaims.slice(0, 5).map(claim => (
                <div key={claim.id} className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                   <div className="bg-indigo-200 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded min-w-[2rem] text-center mt-0.5 shrink-0">
                     {claim.number}
                   </div>
                   <p className="text-sm text-slate-700 font-medium leading-relaxed break-keep line-clamp-3 hover:line-clamp-none transition-all">
                     {claim.conciseExplanation || claim.text}
                   </p>
                </div>
              ))}
              {independentClaims.length > 5 && (
                <div className="text-center pt-1">
                  <p className="text-xs text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">
                    + {independentClaims.length - 5} more independent claims
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
               <Quote className="w-3.5 h-3.5" /> 쉬운 비유 (Analogy)
             </h3>
             <div className="bg-slate-800 text-slate-200 p-6 rounded-xl border border-slate-700 shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Quote className="w-10 h-10 text-white" />
               </div>
               <p className="relative z-10 text-base md:text-lg font-medium italic whitespace-pre-wrap break-keep leading-relaxed">
                 "{essence.analogy}"
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
