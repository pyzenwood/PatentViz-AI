
import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Scale, FileText } from 'lucide-react';
import { ClaimsScope } from '../types';

interface ClaimsScopeAnalysisProps {
  data?: ClaimsScope;
}

const ClaimsScopeAnalysis: React.FC<ClaimsScopeAnalysisProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-800">특허 권리 범위 분석 (Scope of Rights)</h3>
          <p className="text-slate-500 text-xs">청구항 기반의 권리 범위 및 침해 가능성 분석</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Summary Section */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-slate-500" />
            권리 범위 요약 (Summary)
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            {data.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Broad Scope & Embodiments (Positive) */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                독립항 해석 (Broad Scope)
              </h4>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                {data.independentClaimScope}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                적용 대상 (Covered Embodiments)
              </h4>
              <ul className="space-y-2">
                {data.coveredEmbodiments.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <div className="mt-0.5 min-w-[16px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Limitations (Restrictions/Negative) */}
          <div>
            <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-3 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              주요 제약 사항 (Key Limitations)
            </h4>
            <div className="bg-amber-50 rounded-xl p-1 border border-amber-100">
               <ul className="divide-y divide-amber-100">
                 {data.keyLimitations.map((limit, idx) => (
                   <li key={idx} className="p-3 flex items-start gap-3 hover:bg-amber-100/50 transition-colors rounded-lg">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">
                       {idx + 1}
                     </span>
                     <span className="text-sm text-slate-700 leading-relaxed mt-0.5">
                       {limit}
                     </span>
                   </li>
                 ))}
               </ul>
            </div>
            <p className="mt-3 text-xs text-slate-400 px-2">
              * 위 제약 사항들은 회피 설계(Design Around)의 핵심 포인트가 될 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsScopeAnalysis;
