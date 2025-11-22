
export interface PatentClaim {
  id: string;
  number: number;
  type: 'independent' | 'dependent';
  text: string;
  dependencyRef?: number; // If dependent, which claim number it refers to
  explanation?: string; // Simplified explanation
  conciseExplanation?: string; // Short summary (max 15 words)
}

export interface TrizPrinciple {
  number: number;
  name: string;
  description: string;
  application: string; // Specific application in this patent
  level?: number; // 1-5 Innovation contribution of this specific application
}

export interface InventionLevel {
  level: number; // 1-5
  name: string; // e.g., "Level 2: Small Improvement"
  description: string; // Definition of this level
  reasoning: string; // Why this specific patent is at this level
}

export interface TechnologyLifecycle {
  stage: 'Infancy' | 'Growth' | 'Maturity' | 'Decline';
  stageName: string; // Korean name (e.g., 도입기)
  description: string;
  reasoning: string; // Logic based on Invention Level & TRIZ Principles
}

export interface TrizAnalysis {
  contradiction: string; // The identified technical contradiction description
  improvingFeature: string; // Feature to improve
  worseningFeature: string; // Feature that gets worse
  resolutionAbstract: string; // Abstract concept of the solution
  inventionLevel?: InventionLevel; // Made optional to handle legacy data without crashes
  technologyLifecycle?: TechnologyLifecycle; // New field for S-Curve analysis
  principles: TrizPrinciple[];
}

export interface SimilarPatent {
  patentNumber: string;
  title: string;
  assignee: string;
  summary: string;
  inventionLevel: number; // Estimated TRIZ level 1-5
}

export interface Citation {
  number: string;
  title: string;
  assignee?: string;
  date?: string;
  summary?: string;
}

export interface CitationNetworkData {
  backwardCitations: Citation[];
  forwardCitations: Citation[];
}

export interface ClaimsScope {
  summary: string; // Overall summary of rights
  independentClaimScope: string; // Interpretation of independent claim 1
  keyLimitations: string[]; // Critical restrictions found in claims
  coveredEmbodiments: string[]; // What products/methods this covers
}

export interface PatentEssence {
  problem: string; // The specific pain point addressed
  solution: string; // The core technical solution
  benefit: string; // The ultimate value/effect
  analogy: string; // A simple "Like X for Y" analogy
  technicalDepth: string; // Brief assessment of complexity
  keywordTags: string[]; // 3-5 key tags
}

export interface AvoidanceStrategy {
  type: 'Deletion' | 'Substitution' | 'Separation' | 'Radical'; // Strategy type
  title: string; // Short title of the strategy
  description: string; // Detailed explanation
  targetLimitation: string; // Which specific claim limitation is being attacked
  feasibility: 'High' | 'Medium' | 'Low'; // Estimated success/difficulty rate
  riskAnalysis: string; // Potential infringement risk or technical difficulty
}

export interface EvolutionStage {
  stageName: string; // e.g., "Current State", "Next Generation", "Future Ideal"
  description: string; // Description of the technology at this stage
  features: string[]; // Key features/changes
  trizTrend: string; // Related TRIZ trend (e.g., Dynamization, Segmentation)
}

export interface TechnologyEvolution {
  currentStage: EvolutionStage;
  nextStage: EvolutionStage;
  finalStage: EvolutionStage; // Ideal final result
  evolutionLogic: string; // Logic explaining the path
}

// New Interfaces for Functional Analysis (VE)
export interface FunctionUnit {
  component: string; // The subject (part/system)
  action: string; // The verb (what it does)
  object: string; // The noun (what is affected)
  functionType: 'Basic' | 'Secondary' | 'Auxiliary'; // Classification
}

export interface FASTDiagramData {
  higherOrder: string; // Action + Object (Why?)
  basic: string; // Action + Object (Core Function)
  howPath: string[]; // Sequence of Action + Object (How?)
}

export interface FunctionalAnalysis {
  parsedFunctions: FunctionUnit[];
  fastDiagram: FASTDiagramData;
}

export interface PatentData {
  title: string;
  patentNumber?: string; // Extracted patent number if available (e.g., US1234567)
  abstract: string;
  technicalField: string;
  summary: string;
  visualPrompt: string; // The prompt used for image generation
  claims: PatentClaim[];
  claimsScope?: ClaimsScope; // Analysis of the scope of rights
  patentEssence?: PatentEssence; // New field for the infographic
  avoidanceStrategies?: AvoidanceStrategy[]; // New field for TRIZ avoidance strategies
  technologyEvolution?: TechnologyEvolution; // New field for TRIZ evolution analysis
  functionalAnalysis?: FunctionalAnalysis; // New field for VE/FAST analysis
  trizAnalysis: TrizAnalysis;
  similarPatents?: SimilarPatent[];
  citationGraph?: CitationNetworkData;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  patentData: PatentData;
  prototypeImageUrl: string | null;
}

export interface AppState {
  status: 'idle' | 'uploading' | 'analyzing' | 'generating_image' | 'searching_patents' | 'complete' | 'error';
  fileName: string | null;
  patentData: PatentData | null;
  prototypeImageUrl: string | null;
  error: string | null;
}

export enum AnalysisStep {
  IDLE = '파일 대기 중...',
  EXTRACTING = 'PDF 내용 읽는 중...',
  ANALYZING = '특허 구조 및 청구항 분석 중...',
  GENERATING = '제품 프로토타입 렌더링 중...',
  SEARCHING = '유사 특허 검색 중...',
  DONE = '분석 완료'
}
