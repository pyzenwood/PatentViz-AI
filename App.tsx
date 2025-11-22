
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Activity, 
  AlertCircle, 
  Cpu,
  Layers,
  Lightbulb,
  Search,
  Download,
  FileDown,
  Printer
} from 'lucide-react';
import FileUpload from './components/FileUpload';
import PrototypeViewer from './components/PrototypeViewer';
import ClaimsInfographic from './components/ClaimsInfographic';
import ClaimsScopeAnalysis from './components/ClaimsScopeAnalysis';
import FunctionalAnalysis from './components/FunctionalAnalysis';
import TrizAnalysis from './components/TrizAnalysis';
import SimilarPatents from './components/SimilarPatents';
import RecentAnalyses from './components/RecentAnalyses';
import PatentEssenceInfographic from './components/PatentEssenceInfographic';
import ExecutiveSummary from './components/ExecutiveSummary';
import AvoidanceStrategy from './components/AvoidanceStrategy';
import TechnologyEvolutionInfographic from './components/TechnologyEvolutionInfographic';
import { extractTextFromPdf } from './services/pdfService';
import { analyzePatentContent, generateProductPrototype, editProductPrototype, findSimilarPatents, analyzePatentByNumber } from './services/geminiService';
import { saveAnalysis, getRecentAnalyses, clearHistory, deleteHistoryItem } from './services/storageService';
import { AppState, AnalysisStep, PatentData, HistoryItem } from './types';

// Declare html2pdf
declare var html2pdf: any;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    fileName: null,
    patentData: null,
    prototypeImageUrl: null,
    error: null
  });

  const [loadingStep, setLoadingStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getRecentAnalyses());
  }, []);

  const performAnalysisPipeline = async (
    initialDataPromise: Promise<PatentData>, 
    sourceName: string,
    skipExtraction: boolean = false
  ) => {
    setState(prev => ({ 
        ...prev, 
        status: 'analyzing', 
        fileName: sourceName, 
        error: null,
        // Clear previous data
        patentData: null,
        prototypeImageUrl: null
    }));

    try {
      if (skipExtraction) {
        setLoadingStep(AnalysisStep.ANALYZING);
      }

      // Step 2 (or 1): Analyze with Gemini (Structure & TRIZ)
      const data: PatentData = await initialDataPromise;
      
      // Update state with text data first
      setState(prev => ({ ...prev, patentData: data }));

      // Step 3: Search for Similar Patents
      setLoadingStep(AnalysisStep.SEARCHING);
      
      // Run search
      const similarPatents = await findSimilarPatents(data.title, data.abstract);

      data.similarPatents = similarPatents;
      
      setState(prev => ({ ...prev, patentData: data }));

      // Step 4: Generate Prototype Image
      setLoadingStep(AnalysisStep.GENERATING);
      const imageUrl = await generateProductPrototype(data.visualPrompt);

      // Done
      setLoadingStep(AnalysisStep.DONE);
      setState(prev => ({ 
        ...prev, 
        status: 'complete', 
        prototypeImageUrl: imageUrl 
      }));

      // Save to history
      const updatedHistory = saveAnalysis(sourceName, data, imageUrl);
      setHistory(updatedHistory);

    } catch (error: any) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error.message || "An unexpected error occurred." 
      }));
      setLoadingStep(AnalysisStep.IDLE);
    }
  };

  const handleFileSelect = async (file: File) => {
    // Step 1: Extract Text
    setLoadingStep(AnalysisStep.EXTRACTING);
    const textPromise = extractTextFromPdf(file);
    
    const analysisPromise = textPromise.then(text => {
        setLoadingStep(AnalysisStep.ANALYZING);
        return analyzePatentContent(text);
    });

    await performAnalysisPipeline(analysisPromise, file.name, false);
  };

  const handleAnalyzeSimilarPatent = async (patentNumber: string) => {
    // Skip PDF extraction, jump straight to analysis by ID
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const analysisPromise = analyzePatentByNumber(patentNumber);
    await performAnalysisPipeline(analysisPromise, patentNumber, true);
  };

  const handleEditPrototype = async (prompt: string) => {
    if (!state.prototypeImageUrl) return;

    setIsEditing(true);
    try {
      const newImageUrl = await editProductPrototype(state.prototypeImageUrl, prompt);
      setState(prev => ({
        ...prev,
        prototypeImageUrl: newImageUrl
      }));
    } catch (error: any) {
      console.error("Edit failed:", error);
      alert("이미지 수정에 실패했습니다: " + error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setState({
      status: 'complete',
      fileName: item.fileName,
      patentData: item.patentData,
      prototypeImageUrl: item.prototypeImageUrl,
      error: null
    });
    setLoadingStep(AnalysisStep.DONE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm('모든 분석 기록을 삭제하시겠습니까?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const resetApp = () => {
    setState({
      status: 'idle',
      fileName: null,
      patentData: null,
      prototypeImageUrl: null,
      error: null
    });
    setLoadingStep(AnalysisStep.IDLE);
    setIsEditing(false);
  };

  // --- Download Logic ---
  
  const generateMarkdown = (data: PatentData) => {
    let md = `# ${data.title}\n\n`;
    if (data.patentNumber) md += `**특허 번호:** ${data.patentNumber}\n\n`;
    md += `**기술 분야:** ${data.technicalField}\n\n`;
    
    md += `## 1. 요약 (Summary)\n${data.summary}\n\n`;

    if (data.patentEssence) {
      md += `## 2. 특허 핵심 (Patent Essence)\n`;
      md += `- **문제점:** ${data.patentEssence.problem}\n`;
      md += `- **해결책:** ${data.patentEssence.solution}\n`;
      md += `- **효과:** ${data.patentEssence.benefit}\n`;
      md += `- **비유:** ${data.patentEssence.analogy}\n\n`;
    }

    if (data.claims && data.claims.length > 0) {
      md += `## 3. 청구항 분석 (Claims)\n`;
      data.claims.forEach(c => {
        const typeStr = c.type === 'independent' ? '독립항' : '종속항';
        md += `### 청구항 ${c.number} (${typeStr})\n`;
        md += `**${c.conciseExplanation}**\n\n`;
        md += `> ${c.text}\n\n`;
        md += `- 설명: ${c.explanation}\n\n`;
      });
    }

    if (data.trizAnalysis) {
      md += `## 4. TRIZ 분석\n`;
      md += `- **발명 수준:** Level ${data.trizAnalysis.inventionLevel?.level || 'N/A'} (${data.trizAnalysis.inventionLevel?.name})\n`;
      md += `- **모순:** ${data.trizAnalysis.contradiction}\n`;
      md += `- **해결 원리:**\n`;
      data.trizAnalysis.principles.forEach(p => {
        md += `  - ${p.number}. ${p.name}: ${p.application}\n`;
      });
      md += `\n`;
    }

    if (data.technologyEvolution) {
      md += `## 5. 기술 진화 (Technology Evolution)\n`;
      md += `- **현재:** ${data.technologyEvolution.currentStage.stageName} (${data.technologyEvolution.currentStage.trizTrend})\n`;
      md += `- **다음 단계:** ${data.technologyEvolution.nextStage.stageName}\n`;
      md += `- **이상적 결과:** ${data.technologyEvolution.finalStage.stageName}\n\n`;
      md += `**로직:** ${data.technologyEvolution.evolutionLogic}\n`;
    }

    return md;
  };

  const handleDownloadMarkdown = () => {
    if (!state.patentData) return;
    const mdContent = generateMarkdown(state.patentData);
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.fileName || 'patent-analysis'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const opt = {
      margin:       5,
      filename:     `${state.fileName || 'patent-analysis'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Add a loading indication if needed, but html2pdf is usually fast enough for small docs
    html2pdf().set(opt).from(element).save();
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-none">PatentViz AI</h1>
                <p className="text-xs text-slate-500 font-medium">Analysis & Prototyping</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               {state.status !== 'idle' && (
                <button 
                  onClick={resetApp}
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors"
                >
                  다른 특허 분석하기
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error State */}
        {state.status === 'error' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">분석 실패</h3>
              <p className="text-sm text-red-600">{state.error}</p>
              <button 
                onClick={resetApp}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* Idle State / Upload */}
        {state.status === 'idle' && (
          <div className="max-w-2xl mx-auto mt-10 text-center animate-fade-in-up pb-20">
             <h2 className="text-3xl font-bold text-slate-800 mb-4">특허를 프로토타입으로 변환</h2>
             <p className="text-lg text-slate-600 mb-8">
               특허 PDF를 업로드하여 Gemini AI를 통해 제품 프로토타입을 생성하고 
               청구항 구조를 시각화하세요.
             </p>

             <div className="bg-white p-1 rounded-2xl shadow-xl shadow-slate-200/50">
               <FileUpload onFileSelect={handleFileSelect} isProcessing={false} />
             </div>
             
             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <FeatureCard 
                  icon={<FileText className="w-5 h-5 text-blue-500" />}
                  title="즉각적인 요약"
                  desc="특허의 요약, 기술 분야, 발명 내용을 자동으로 추출합니다."
                />
                <FeatureCard 
                  icon={<Search className="w-5 h-5 text-purple-500" />}
                  title="유사 특허 검색"
                  desc="Google Patents를 검색하여 유사한 선행 기술을 찾습니다."
                />
                <FeatureCard 
                  icon={<Activity className="w-5 h-5 text-emerald-500" />}
                  title="시각적 프로토타이핑"
                  desc="특허 설명을 바탕으로 현실적인 제품 이미지를 생성합니다."
                />
             </div>

             {/* Recent Analyses Section */}
             <RecentAnalyses 
               items={history}
               onSelect={handleHistorySelect}
               onClear={handleClearHistory}
               onDelete={handleDeleteHistoryItem}
             />
          </div>
        )}

        {/* Processing State */}
        {(state.status === 'analyzing' || state.status === 'searching_patents' || state.status === 'generating_image') && (
           <div className="max-w-xl mx-auto mt-20 text-center">
             <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <Cpu className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">특허 분석 중</h2>
             <p className="text-blue-600 font-medium mb-6">{loadingStep}</p>
             
             <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: loadingStep === AnalysisStep.EXTRACTING ? '20%' : 
                           loadingStep === AnalysisStep.ANALYZING ? '40%' :
                           loadingStep === AnalysisStep.SEARCHING ? '70%' :
                           loadingStep === AnalysisStep.GENERATING ? '90%' : '100%' 
                  }}
                ></div>
             </div>
           </div>
        )}

        {/* Results Dashboard */}
        {(state.status === 'complete' || (state.status === 'generating_image' && state.patentData)) && state.patentData && (
          <div className="animate-fade-in-up space-y-6" ref={reportRef}>
            
            {/* Header Info with Download Buttons */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      특허 분석
                    </span>
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {state.fileName}
                    </span>
                    {state.patentData.patentNumber && (
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                        {state.patentData.patentNumber}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {state.patentData.title}
                  </h1>
                </div>
                
                {/* Download Actions - hidden in print/pdf mode slightly if using media query, but html2pdf captures visually */}
                <div className="flex gap-2 shrink-0" data-html2canvas-ignore>
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    title="Markdown으로 다운로드"
                  >
                    <FileDown className="w-4 h-4" />
                    <span className="hidden md:inline">Markdown</span>
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
                    title="PDF로 보고서 저장"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden md:inline">PDF 저장</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Executive Summary (New) */}
            {state.patentData.patentEssence && state.patentData.claims && (
               <ExecutiveSummary 
                 summary={state.patentData.summary}
                 essence={state.patentData.patentEssence}
                 claims={state.patentData.claims}
               />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Prototype (4 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-lg font-bold text-slate-800">AI 프로토타입</h2>
                    </div>
                  </div>
                  <PrototypeViewer 
                    imageUrl={state.prototypeImageUrl} 
                    prompt={state.patentData.visualPrompt}
                    isLoading={loadingStep === AnalysisStep.GENERATING}
                    isEditing={isEditing}
                    onEdit={handleEditPrototype}
                  />
                </section>

                <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">기술 분야</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {state.patentData.technicalField}
                  </p>
                </section>
              </div>

              {/* Right Column: Essence, Claims & TRIZ (8 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Patent Essence Infographic */}
                {state.patentData.patentEssence && (
                   <PatentEssenceInfographic data={state.patentData.patentEssence} />
                )}

                {/* Similar Patents Table */}
                {state.patentData.similarPatents && state.patentData.similarPatents.length > 0 && (
                  <SimilarPatents 
                    patents={state.patentData.similarPatents} 
                    currentInventionLevel={state.patentData.trizAnalysis?.inventionLevel?.level}
                    onAnalyzeSimilar={handleAnalyzeSimilarPatent}
                  />
                )}

                 {/* Claims Section */}
                {state.patentData.claims && state.patentData.claims.length > 0 && (
                  <div className="flex-1 min-h-[600px]">
                     <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-blue-500" />
                      <h2 className="text-lg font-bold text-slate-800">청구항 분석</h2>
                    </div>
                    <ClaimsInfographic claims={state.patentData.claims} />
                  </div>
                )}

                {/* Scope of Rights Analysis */}
                {state.patentData.claimsScope && (
                  <ClaimsScopeAnalysis data={state.patentData.claimsScope} />
                )}

                {/* Functional Analysis (VE/FAST) */}
                {state.patentData.functionalAnalysis && (
                  <FunctionalAnalysis data={state.patentData.functionalAnalysis} />
                )}

                {/* TRIZ Analysis Section */}
                {state.patentData.trizAnalysis && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg font-bold text-slate-800">TRIZ 분석 (발명 원리)</h2>
                    </div>
                    <TrizAnalysis 
                        data={state.patentData.trizAnalysis} 
                        similarPatents={state.patentData.similarPatents}
                    />
                  </div>
                )}

                {/* Avoidance Strategy */}
                {state.patentData.avoidanceStrategies && (
                  <AvoidanceStrategy strategies={state.patentData.avoidanceStrategies} />
                )}

                {/* Technology Evolution Infographic */}
                {state.patentData.technologyEvolution && (
                  <TechnologyEvolutionInfographic data={state.patentData.technologyEvolution} />
                )}

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

export default App;
