
import React, { useState } from 'react';
import { CitationNetworkData, Citation } from '../types';
import { GitFork, ArrowRight, ArrowLeft, Calendar, Building, ExternalLink } from 'lucide-react';

interface CitationGraphProps {
  data: CitationNetworkData;
  currentPatentTitle: string;
  currentPatentNumber?: string;
}

const CitationGraph: React.FC<CitationGraphProps> = ({ data, currentPatentTitle, currentPatentNumber }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const hasForward = data.forwardCitations.length > 0;
  const hasBackward = data.backwardCitations.length > 0;

  // If no data at all
  if (!hasBackward && !hasForward) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
        <GitFork className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p>인용 정보를 찾을 수 없습니다 (신규 출원 또는 데이터 부족).</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">인용/피인용 네트워크 (Citation Graph)</h3>
            <p className="text-slate-500 text-xs">기술의 흐름: 선행 기술(좌) → 현재 기술(중앙) → 후속 기술(우)</p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px] p-6 overflow-x-auto bg-slate-50/30 flex items-center justify-center">
        <div className="flex items-stretch gap-12 md:gap-24 min-w-[800px]">
          
          {/* Left Column: Backward Citations (Prior Art) */}
          <div className="flex flex-col justify-center gap-4 flex-1">
             <div className="text-center mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">인용 (References)</span>
             </div>
             {data.backwardCitations.length > 0 ? (
               data.backwardCitations.map((citation, idx) => (
                 <CitationCard 
                   key={idx} 
                   citation={citation} 
                   direction="backward" 
                   isHovered={hoveredNode === citation.number}
                   onHover={() => setHoveredNode(citation.number)}
                 />
               ))
             ) : (
               <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                 선행 인용 없음
               </div>
             )}
          </div>

          {/* Center Column: Current Patent */}
          <div className="flex flex-col justify-center relative z-10">
            <div className="relative">
               {/* Connection Lines Layer */}
               <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none overflow-visible -z-10 hidden md:block">
                  {/* We would draw SVG curves here if we had exact coordinates, 
                      but simple CSS pseudo-elements in cards work better for responsive lists.
                      This is just a placeholder for potential complex drawing.
                  */}
               </svg>

               <div className="w-64 bg-white rounded-xl border-2 border-blue-500 shadow-lg p-5 relative transform transition-transform hover:scale-105">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                   Current Invention
                 </div>
                 
                 <div className="text-center space-y-2">
                   <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                     <Building className="w-6 h-6 text-blue-600" />
                   </div>
                   <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">
                     {currentPatentTitle}
                   </h4>
                   {currentPatentNumber && (
                     <p className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                       {currentPatentNumber}
                     </p>
                   )}
                 </div>

                 {/* Connectors */}
                 <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-blue-200"></div>
                 <div className="absolute top-1/2 -left-6 w-2 h-2 bg-blue-400 rounded-full -translate-y-[3px]"></div>
                 
                 <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-blue-200"></div>
                 <div className="absolute top-1/2 -right-1 w-2 h-2 bg-blue-400 rounded-full -translate-y-[3px]"></div>
               </div>
            </div>
          </div>

          {/* Right Column: Forward Citations (Citing Patents) */}
          <div className="flex flex-col justify-center gap-4 flex-1">
             <div className="text-center mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">피인용 (Cited By)</span>
             </div>
             {data.forwardCitations.length > 0 ? (
               data.forwardCitations.map((citation, idx) => (
                 <CitationCard 
                   key={idx} 
                   citation={citation} 
                   direction="forward"
                   isHovered={hoveredNode === citation.number}
                   onHover={() => setHoveredNode(citation.number)}
                 />
               ))
             ) : (
               <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                 후속 피인용 없음<br/>(최신 특허/미공개)
               </div>
             )}
          </div>

        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>* 실선은 기술적 영향 관계를 나타냅니다.</span>
        <span>Source: Google Patents Analysis</span>
      </div>
    </div>
  );
};

const CitationCard: React.FC<{ 
  citation: Citation; 
  direction: 'forward' | 'backward';
  isHovered: boolean;
  onHover: (id: string) => void;
}> = ({ citation, direction, isHovered, onHover }) => {
  return (
    <div 
      onMouseEnter={() => onHover(citation.number)}
      onMouseLeave={() => onHover('')}
      className={`
        relative group p-4 bg-white rounded-lg border transition-all duration-300 w-60 cursor-pointer
        ${isHovered ? 'border-indigo-400 shadow-md scale-105 z-10' : 'border-slate-200 hover:border-indigo-300'}
      `}
    >
      {/* Connector Lines */}
      {direction === 'backward' && (
        <div className="absolute top-1/2 -right-12 w-12 h-px bg-slate-300 group-hover:bg-indigo-400 transition-colors"></div>
      )}
      {direction === 'forward' && (
        <div className="absolute top-1/2 -left-12 w-12 h-px bg-slate-300 group-hover:bg-indigo-400 transition-colors"></div>
      )}

      <div className="flex justify-between items-start mb-2">
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded border
          ${direction === 'backward' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}
        `}>
          {citation.date || 'N/A'}
        </span>
        <a 
          href={`https://patents.google.com/patent/${citation.number.replace(/\s/g,'')}`}
          target="_blank"
          rel="noreferrer" 
          className="text-slate-400 hover:text-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <h5 className="font-bold text-slate-800 text-xs line-clamp-2 mb-1 group-hover:text-indigo-700 transition-colors">
        {citation.title}
      </h5>
      
      <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
        <Building className="w-3 h-3" />
        <span className="truncate max-w-[120px]">{citation.assignee || 'Unknown'}</span>
      </div>

      {citation.summary && (
        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-1.5 rounded">
          {citation.summary}
        </p>
      )}
    </div>
  );
};

export default CitationGraph;
