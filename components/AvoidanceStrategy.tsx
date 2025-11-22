
import React from 'react';
import { ShieldOff, Scissors, RefreshCw, Split, Zap, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { AvoidanceStrategy as AvoidanceStrategyType } from '../types';

interface AvoidanceStrategyProps {
  strategies?: AvoidanceStrategyType[];
}

const AvoidanceStrategy: React.FC<AvoidanceStrategyProps> = ({ strategies }) => {
  if (!strategies || strategies.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deletion': return <Scissors className="w-5 h-5" />;
      case 'Substitution': return <RefreshCw className="w-5 h-5" />;
      case 'Separation': return <Split className="w-5 h-5" />;
      case 'Radical': return <Zap className="w-5 h-5" />;
      default: return <ShieldOff className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'Deletion': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Substitution': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Separation': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Radical': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getFeasibilityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldOff className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">회피 설계 전략 (Design Around)</h3>
            <p className="text-slate-500 text-xs">TRIZ 기반 특허 침해 회피 및 대안 설계 제안</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, idx) => (
          <div key={idx} className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${getColor(strategy.type).replace('text-', 'border-b-slate-100 ')}`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${getColor(strategy.type).split(' ')[0]}`}>
                {getIcon(strategy.type)}
                <span>{strategy.type === 'Deletion' ? '제거 (Trimming)' : 
                       strategy.type === 'Substitution' ? '대체 (Substitution)' :
                       strategy.type === 'Separation' ? '분리 (Separation)' : '근본적 변경'}</span>
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded border ${getFeasibilityColor(strategy.feasibility)}`}>
                실현 가능성: {strategy.feasibility}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{strategy.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{strategy.description}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-auto">
                <div className="flex items-start gap-2 mb-2">
                   <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                   <div>
                     <span className="text-xs font-bold text-rose-700 block uppercase tracking-wide">Target Limitation (공략 대상)</span>
                     <p className="text-xs text-slate-700">{strategy.targetLimitation}</p>
                   </div>
                </div>
                <div className="h-px bg-slate-200 w-full my-2"></div>
                <div className="flex items-start gap-2">
                   <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                   <div>
                     <span className="text-xs font-bold text-slate-500 block uppercase tracking-wide">Risk Analysis (위험 분석)</span>
                     <p className="text-xs text-slate-600">{strategy.riskAnalysis}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>본 회피 설계 제안은 AI 분석 결과이며, 법적 효력이 없습니다. 실제 제품 개발 시에는 반드시 변리사의 검토를 받으시기 바랍니다.</span>
      </div>
    </div>
  );
};

export default AvoidanceStrategy;
