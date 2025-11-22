
import React from 'react';
import { ArrowRight, Zap, Clock, Rocket, TrendingUp, CheckCircle2 } from 'lucide-react';
import { TechnologyEvolution } from '../types';

interface TechnologyEvolutionInfographicProps {
  data?: TechnologyEvolution;
}

const TechnologyEvolutionInfographic: React.FC<TechnologyEvolutionInfographicProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">기술 시스템 진화 법칙 (TRIZ Evolution)</h3>
            <p className="text-slate-500 text-xs">현재 기술의 미래 발전 방향 및 이상적 해결안 예측</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Logic Summary */}
        <div className="mb-10 bg-purple-50 rounded-xl p-5 border border-purple-100 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
             <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
               <TrendingUp className="w-4 h-4" />
               진화 로직 (Evolution Logic)
             </h4>
             <p className="text-slate-700 text-sm leading-relaxed">
               {data.evolutionLogic}
             </p>
          </div>
        </div>

        {/* Evolution Timeline Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block absolute top-16 left-1/3 w-full h-0.5 bg-slate-100 -z-10">
            <div className="absolute right-[calc(66%+1rem)] w-full h-full bg-gradient-to-r from-transparent via-slate-200 to-slate-100"></div>
          </div>
          
          {/* Stage 1: Current */}
          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 uppercase tracking-wider z-20">
              <Clock className="w-3 h-3" /> Current
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 h-full hover:shadow-md transition-all hover:-translate-y-1 relative z-10">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded mb-2">
                   Trend: {data.currentStage.trizTrend}
                </span>
                <h4 className="text-lg font-bold text-slate-800">{data.currentStage.stageName}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-4 min-h-[3rem]">
                {data.currentStage.description}
              </p>
              <ul className="space-y-2">
                {data.currentStage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Arrow for Mobile */}
            <div className="md:hidden flex justify-center my-2 text-slate-300">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
            
            {/* Arrow for Desktop */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 text-slate-300 bg-white rounded-full p-1 shadow-sm border border-slate-100">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Stage 2: Next Generation */}
          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1 uppercase tracking-wider z-20">
              <TrendingUp className="w-3 h-3" /> Next Step
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-6 h-full hover:shadow-md hover:shadow-blue-500/10 transition-all hover:-translate-y-1 relative z-10 ring-1 ring-blue-50">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-2">
                   Trend: {data.nextStage.trizTrend}
                </span>
                <h4 className="text-lg font-bold text-blue-900">{data.nextStage.stageName}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-4 min-h-[3rem]">
                {data.nextStage.description}
              </p>
              <ul className="space-y-2">
                {data.nextStage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow for Mobile */}
            <div className="md:hidden flex justify-center my-2 text-slate-300">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>

             {/* Arrow for Desktop */}
             <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 text-blue-300 bg-white rounded-full p-1 shadow-sm border border-blue-100">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Stage 3: Ideal Final Result */}
          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1 uppercase tracking-wider z-20">
              <Zap className="w-3 h-3" /> Ideal Result
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6 h-full hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-1 relative z-10">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded mb-2">
                   Trend: {data.finalStage.trizTrend}
                </span>
                <h4 className="text-lg font-bold text-purple-900">{data.finalStage.stageName}</h4>
              </div>
              <p className="text-sm text-slate-700 mb-4 min-h-[3rem]">
                {data.finalStage.description}
              </p>
              <ul className="space-y-2">
                {data.finalStage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <Zap className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0 fill-purple-100" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TechnologyEvolutionInfographic;
