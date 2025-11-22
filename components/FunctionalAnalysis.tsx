
import React from 'react';
import { FunctionalAnalysis as FunctionalAnalysisType } from '../types';
import { Activity, Settings, Target, HelpCircle, ChevronRight, ArrowRight, GitCommit, Microscope } from 'lucide-react';

interface FunctionalAnalysisProps {
  data?: FunctionalAnalysisType;
}

const FunctionalAnalysis: React.FC<FunctionalAnalysisProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">가치 공학 (VE) 기능 분석</h3>
            <p className="text-slate-500 text-xs">기능 정의 (Subject+Action+Object) 및 FAST 다이어그램</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. Function Definition Table */}
        <div>
           <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
             <Activity className="w-4 h-4 text-slate-500" />
             기능 단위 정의 (Subject + Action + Object)
           </h4>
           <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-semibold">
                 <tr>
                   <th className="px-4 py-3 border-b border-slate-200 w-[20%] bg-slate-100/50">Subject (주어)</th>
                   <th className="px-4 py-3 border-b border-slate-200 w-[20%] bg-indigo-50/50 text-indigo-700">Action (동사)</th>
                   <th className="px-4 py-3 border-b border-slate-200 w-[40%] bg-slate-100/50">Object (목적어)</th>
                   <th className="px-4 py-3 border-b border-slate-200 w-[20%]">Type (분류)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {data.parsedFunctions.map((func, idx) => (
                   <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-4 py-3 font-medium text-slate-800 border-r border-slate-100">{func.component}</td>
                     <td className="px-4 py-3 text-indigo-700 font-bold border-r border-slate-100 bg-indigo-50/10">{func.action}</td>
                     <td className="px-4 py-3 text-slate-600 border-r border-slate-100">{func.object}</td>
                     <td className="px-4 py-3">
                       <span className={`px-2 py-1 rounded text-xs font-bold border inline-block ${
                         func.functionType === 'Basic' 
                           ? 'bg-blue-50 text-blue-600 border-blue-200' 
                           : func.functionType === 'Secondary' 
                             ? 'bg-slate-100 text-slate-500 border-slate-200'
                             : 'bg-amber-50 text-amber-600 border-amber-200'
                       }`}>
                         {func.functionType}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* 2. FAST Diagram Visualization */}
        <div>
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-slate-500" />
                FAST 다이어그램 (Logic Path)
              </h4>
              
              {/* Legend for Why/How */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                 <div className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium text-slate-600">
                    <ArrowRight className="w-3 h-3 rotate-180" />
                    <span>Why? (목적)</span>
                 </div>
                 <div className="w-px h-4 bg-slate-300 mx-1"></div>
                 <div className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium text-slate-600">
                    <span>How? (수단)</span>
                    <ArrowRight className="w-3 h-3" />
                 </div>
              </div>
           </div>

           <div className="relative bg-slate-50 rounded-2xl p-8 border border-slate-200 overflow-hidden">
              {/* Decorative Background Grid */}
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ 
                     backgroundImage: 'linear-gradient(90deg, #cbd5e1 1px, transparent 1px), linear-gradient(#cbd5e1 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                   }}>
              </div>

              <div className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
                 <div className="flex items-center min-w-max px-4 py-6">
                    
                    {/* 1. Higher Order Function Node */}
                    <div className="flex flex-col items-center group">
                       <div className="mb-3 text-[10px] font-bold text-purple-500 uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-full border border-purple-100 shadow-sm">
                         Higher Order Function
                       </div>
                       <div className="w-48 h-32 bg-white border-2 border-dashed border-purple-200 rounded-2xl shadow-sm flex flex-col items-center justify-center p-4 text-center transition-all hover:border-purple-400 hover:shadow-md hover:-translate-y-1 relative">
                          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                            <Target className="w-5 h-5 text-purple-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{data.fastDiagram.higherOrder}</span>
                       </div>
                    </div>

                    {/* Link 1 */}
                    <div className="w-16 h-0.5 bg-slate-300 relative flex items-center justify-center">
                       <div className="absolute -top-3 text-[10px] font-bold text-slate-400">Why</div>
                       <div className="absolute -bottom-4 text-[10px] font-bold text-slate-400">How</div>
                       <ArrowRight className="w-4 h-4 text-slate-300 absolute right-0 -mt-[0.5px]" />
                    </div>

                    {/* 2. Basic Function Node (Center) */}
                    <div className="flex flex-col items-center group">
                       <div className="mb-3 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full border border-blue-100 shadow-sm">
                         Basic Function
                       </div>
                       <div className="w-48 h-32 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 flex flex-col items-center justify-center p-4 text-center transition-all hover:shadow-blue-300 hover:scale-105 relative ring-4 ring-blue-50 border border-blue-500">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-md">
                            <Microscope className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-base font-bold">{data.fastDiagram.basic}</span>
                       </div>
                    </div>

                    {/* Link 2 */}
                    <div className="w-16 h-0.5 bg-slate-300 relative flex items-center justify-center">
                       <div className="absolute -top-3 text-[10px] font-bold text-slate-400">Why</div>
                       <div className="absolute -bottom-4 text-[10px] font-bold text-slate-400">How</div>
                       <ArrowRight className="w-4 h-4 text-slate-300 absolute right-0 -mt-[0.5px]" />
                    </div>

                    {/* 3. Implementation Path Container */}
                    <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 flex items-center gap-2 relative">
                       <div className="absolute -top-4 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                          Implementation Steps
                       </div>
                       
                       {data.fastDiagram.howPath.map((func, i) => (
                          <React.Fragment key={i}>
                             <div className="w-40 h-24 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-3 text-center hover:border-indigo-300 hover:shadow-md transition-all">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center mb-2">
                                   {i + 1}
                                </span>
                                <span className="text-xs font-medium text-slate-700 leading-tight">{func}</span>
                             </div>
                             {i < data.fastDiagram.howPath.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                             )}
                          </React.Fragment>
                       ))}
                    </div>

                 </div>
              </div>

              {/* Guide Footer */}
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
                 <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                 <p>
                   FAST(Function Analysis System Technique) 다이어그램은 왼쪽에서 오른쪽으로 읽으면 
                   <strong> "어떻게(How) 기능을 수행하는가?"</strong>에 대한 답이 되고, 
                   오른쪽에서 왼쪽으로 읽으면 
                   <strong> "왜(Why) 그 기능을 수행해야 하는가?"</strong>에 대한 논리적 근거가 됩니다.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalAnalysis;
