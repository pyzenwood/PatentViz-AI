
import { GoogleGenAI, Type } from "@google/genai";
import { PatentData, SimilarPatent, PatentClaim } from "../types";

// Add declaration for window.pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

const PATENT_DATA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    patentNumber: { type: Type.STRING, description: "The patent number if found (e.g., US10234567B2), otherwise empty string." },
    abstract: { type: Type.STRING },
    technicalField: { type: Type.STRING },
    summary: { type: Type.STRING },
    visualPrompt: { type: Type.STRING, description: "A detailed prompt in English for generating an image of the product." },
    claims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          number: { type: Type.NUMBER },
          type: { type: Type.STRING, enum: ["independent", "dependent"] },
          text: { type: Type.STRING },
          dependencyRef: { type: Type.NUMBER, description: "The number of the parent claim if dependent, else null" },
          explanation: { type: Type.STRING },
          conciseExplanation: { type: Type.STRING, description: "A short summary title of the claim (10-15 words)." }
        },
        required: ["id", "number", "type", "text", "explanation", "conciseExplanation"]
      }
    },
    claimsScope: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "Overall summary of the scope of rights in Korean." },
        independentClaimScope: { type: Type.STRING, description: "Detailed interpretation of the independent claim's scope in Korean." },
        keyLimitations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of key limitations that restrict the scope in Korean."
        },
        coveredEmbodiments: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of product/method examples covered by this patent in Korean."
        }
      },
      required: ["summary", "independentClaimScope", "keyLimitations", "coveredEmbodiments"]
    },
    patentEssence: {
      type: Type.OBJECT,
      description: "Key essence of the patent for a general audience infographic.",
      properties: {
        problem: { type: Type.STRING, description: "The specific pain point or problem this patent solves (in Korean)." },
        solution: { type: Type.STRING, description: "The core technical solution provided by the patent (in Korean)." },
        benefit: { type: Type.STRING, description: "The ultimate value, effect, or advantage of using this invention (in Korean)." },
        analogy: { type: Type.STRING, description: "A simple 'Like X for Y' analogy to explain the invention to a layperson (in Korean)." },
        technicalDepth: { type: Type.STRING, description: "A brief assessment of technical complexity (e.g., High, Medium, Low) and why (in Korean)." },
        keywordTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 key hashtags describing the invention (in Korean)." }
      },
      required: ["problem", "solution", "benefit", "analogy", "technicalDepth", "keywordTags"]
    },
    functionalAnalysis: {
      type: Type.OBJECT,
      description: "Value Engineering (VE) Functional Analysis and FAST Diagram construction.",
      properties: {
        parsedFunctions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              component: { type: Type.STRING, description: "The physical component or subject (Subject) in Korean." },
              action: { type: Type.STRING, description: "The verb describing the function (Action) in Korean." },
              object: { type: Type.STRING, description: "The object acted upon (Object) in Korean." },
              functionType: { type: Type.STRING, enum: ["Basic", "Secondary", "Auxiliary"], description: "Classification of the function." }
            },
            required: ["component", "action", "object", "functionType"]
          },
          description: "Decomposition of the Independent Claim into Subject+Action+Object functional units."
        },
        fastDiagram: {
          type: Type.OBJECT,
          properties: {
            higherOrder: { type: Type.STRING, description: "The Higher Order Function (Why is the Basic Function done?) - Action + Object in Korean." },
            basic: { type: Type.STRING, description: "The Basic Function (Core purpose) - Action + Object in Korean." },
            howPath: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A sequence of 3-5 implementation functions (Action + Object) explaining HOW the Basic Function is achieved, ordered logically from left to right in Korean."
            }
          },
          required: ["higherOrder", "basic", "howPath"]
        }
      },
      required: ["parsedFunctions", "fastDiagram"]
    },
    avoidanceStrategies: {
      type: Type.ARRAY,
      description: "3-4 strategic methods to design around the patent claims using TRIZ principles.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["Deletion", "Substitution", "Separation", "Radical"], description: "The type of TRIZ strategy used." },
          title: { type: Type.STRING, description: "Short title of the strategy in Korean." },
          description: { type: Type.STRING, description: "Detailed explanation of how to modify the design to avoid infringement in Korean." },
          targetLimitation: { type: Type.STRING, description: "The specific claim limitation/element being removed or changed in Korean." },
          feasibility: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Estimated technical feasibility of this strategy." },
          riskAnalysis: { type: Type.STRING, description: "Brief analysis of remaining infringement risk or technical trade-offs in Korean." }
        },
        required: ["type", "title", "description", "targetLimitation", "feasibility", "riskAnalysis"]
      }
    },
    technologyEvolution: {
      type: Type.OBJECT,
      description: "Prediction of technology evolution based on TRIZ Laws of Technical Systems Evolution.",
      properties: {
        currentStage: {
          type: Type.OBJECT,
          properties: {
            stageName: { type: Type.STRING, description: "Name of the current technology stage in Korean." },
            description: { type: Type.STRING, description: "Description of the current state in Korean." },
            features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key features of the current state in Korean." },
            trizTrend: { type: Type.STRING, description: "Relevant TRIZ evolution trend for this stage in Korean (e.g. Rigid system)." }
          },
          required: ["stageName", "description", "features", "trizTrend"]
        },
        nextStage: {
          type: Type.OBJECT,
          properties: {
            stageName: { type: Type.STRING, description: "Name of the predicted next stage in Korean." },
            description: { type: Type.STRING, description: "Description of the next evolutionary step in Korean." },
            features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key features of the next stage in Korean." },
            trizTrend: { type: Type.STRING, description: "Relevant TRIZ evolution trend driving this change in Korean (e.g. Dynamization, Segmentation)." }
          },
          required: ["stageName", "description", "features", "trizTrend"]
        },
        finalStage: {
          type: Type.OBJECT,
          properties: {
            stageName: { type: Type.STRING, description: "Name of the ideal final result stage in Korean." },
            description: { type: Type.STRING, description: "Description of the ultimate ideal state in Korean." },
            features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key features of the ideal state in Korean." },
            trizTrend: { type: Type.STRING, description: "Relevant TRIZ evolution trend leading to ideality in Korean (e.g. Self-X, Micro-level transition)." }
          },
          required: ["stageName", "description", "features", "trizTrend"]
        },
        evolutionLogic: { type: Type.STRING, description: "Logical reasoning for this evolution path based on TRIZ laws in Korean." }
      },
      required: ["currentStage", "nextStage", "finalStage", "evolutionLogic"]
    },
    trizAnalysis: {
      type: Type.OBJECT,
      properties: {
        contradiction: { type: Type.STRING, description: "Description of the technical contradiction in Korean." },
        improvingFeature: { type: Type.STRING, description: "The feature being improved in Korean." },
        worseningFeature: { type: Type.STRING, description: "The feature that worsens or prevents improvement in Korean." },
        resolutionAbstract: { type: Type.STRING, description: "Abstract concept of how the contradiction is resolved in Korean." },
        inventionLevel: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.NUMBER, description: "Level 1-5" },
            name: { type: Type.STRING, description: "Name of the level in Korean" },
            description: { type: Type.STRING, description: "Definition of the level in Korean" },
            reasoning: { type: Type.STRING, description: "Detailed reasoning for the classification in Korean, explicitly referencing Altshuller's criteria (e.g. resolution of contradiction, knowledge source)." }
          },
          required: ["level", "name", "description", "reasoning"]
        },
        technologyLifecycle: {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING, enum: ["Infancy", "Growth", "Maturity", "Decline"] },
            stageName: { type: Type.STRING, description: "Korean name for the stage (e.g., 도입기, 성장기, 성숙기, 쇠퇴기)" },
            description: { type: Type.STRING, description: "Description of this stage in the context of this patent." },
            reasoning: { type: Type.STRING, description: "Logical reasoning connecting the Invention Level and TRIZ Principles to this lifecycle stage." }
          },
          required: ["stage", "stageName", "description", "reasoning"]
        },
        principles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.NUMBER, description: "Principle number (1-40)" },
              name: { type: Type.STRING, description: "Name of the principle in Korean" },
              description: { type: Type.STRING, description: "General description of the principle in Korean" },
              application: { type: Type.STRING, description: "How this principle is applied in the patent in Korean" },
              level: { type: Type.NUMBER, description: "Innovation level 1-5 of this principle application" }
            },
            required: ["number", "name", "description", "application", "level"]
          }
        }
      },
      required: ["contradiction", "improvingFeature", "worseningFeature", "resolutionAbstract", "inventionLevel", "technologyLifecycle", "principles"]
    }
  },
  required: ["title", "abstract", "claims", "visualPrompt", "summary", "claimsScope", "patentEssence", "functionalAnalysis", "avoidanceStrategies", "technologyEvolution", "trizAnalysis"]
};

export const analyzePatentContent = async (text: string): Promise<PatentData> => {
  const ai = getClient();
  
  // Truncate text if excessively long to fit within reasonable limits
  const truncatedText = text.length > 100000 ? text.slice(0, 100000) + "...[truncated]" : text;

  const systemInstruction = `You are an expert patent attorney, product designer, Value Engineer, and TRIZ Master. Analyze the patent text provided and generate the results in Korean (Hangul).`;

  const userPrompt = `
    Analyze the following patent text:
    
    1. Identify the Title, Patent Number (if applicable), Abstract, and Technical Field. Translate them into Korean.
    2. Create a concise Summary of the invention in Korean.
    3. Extract the Claims. For each claim, determine if it is 'independent' or 'dependent'. 
       If dependent, identify the claim number it depends on.
       Provide a 'conciseExplanation' (max 10-15 words) capturing the core essence/title of the claim in Korean.
       Provide a detailed simplified 'explanation' of what the claim covers in Korean.
       Translate the claim 'text' to Korean.
    4. Analyze the **Scope of Rights (Claims Scope)** in Korean:
       - Provide a general **Summary** of the legal protection scope.
       - Interpret the scope of the **Independent Claim(s)** broadly.
       - Identify **Key Limitations** (specific elements/steps) that restrict the scope and make it easier to avoid infringement.
       - List **Covered Embodiments** (examples of products/methods that would infringe).
    5. Create a **Patent Essence Infographic** analysis: Problem, Solution, Benefit, Analogy.
    6. Create a highly detailed 'visualPrompt' in English that describes the physical appearance of the invention described in the patent. 
       Note: Keep the 'visualPrompt' in English to ensure the best quality for the image generation model.
       Focus on materials, shape, colors, interfaces, and context.
    7. **Value Engineering (Functional Analysis)**:
       - Decompose the Independent Claim into "Subject + Action + Object" functional units.
       - Construct a **FAST Diagram** (Function Analysis System Technique) structure:
         - Identify the Higher Order Function (Why?).
         - Identify the Basic Function (What?).
         - Identify a sequence of 3-5 Implementation Functions (How?).
    8. **TRIZ Design Around Strategy (Avoidance)**:
       - Identify specific "Key Limitations" in the Independent Claims.
       - Propose 3-4 logical **Design Around Strategies** to avoid infringement.
    9. **TRIZ Technology Evolution Analysis**: 
       - Apply **TRIZ Laws of Technical Systems Evolution**.
       - Predict Current -> Next -> Ideal stages.
    10. Perform a rigorous TRIZ Analysis:
       - **Technical Contradiction**: Identify the core trade-off.
       - **Invention Level (Altshuller's Levels 1-5)**.
       - **Technology Life Cycle Inference** (S-Curve).
       - **Inventive Principles (40 Principles)**.
    
    PATENT TEXT:
    ${truncatedText}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { 
        role: 'user', 
        parts: [{ text: userPrompt }] 
      }
    ],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: PATENT_DATA_SCHEMA
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("No response from Gemini");

  return JSON.parse(resultText) as PatentData;
};

export const analyzePatentByNumber = async (patentNumber: string): Promise<PatentData> => {
  const ai = getClient();
  
  const systemInstruction = `You are an expert patent attorney, Value Engineer, and TRIZ Master. The user will provide a Patent Number. You must retrieve the details of this patent from your internal knowledge base and analyze it exactly as if the full text was provided. Generate the results in Korean (Hangul).`;

  const userPrompt = `
    Analyze Patent Number: "${patentNumber}"

    1. Retrieve the Title, Abstract, Technical Field, and Claims for this specific patent.
    2. Create a concise Summary of the invention in Korean.
    3. Reconstruct/Extract the Claims.
    4. Analyze the **Scope of Rights (Claims Scope)** in Korean.
    5. Create a **Patent Essence Infographic** analysis.
    6. Create a detailed 'visualPrompt' in English for the physical product.
    7. **Value Engineering (Functional Analysis)**: Perform decomposition and FAST Diagram construction for the independent claims.
    8. **TRIZ Design Around Strategy**: Propose 3-4 specific strategies.
    9. **TRIZ Technology Evolution Analysis**: Predict Current -> Next -> Ideal stages based on TRIZ laws.
    10. Perform a rigorous TRIZ Analysis including Contradiction, Principles, Level 1-5, and **Technology Life Cycle inference**.
    
    Perform the analysis for patent: ${patentNumber}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { 
        role: 'user', 
        parts: [{ text: userPrompt }] 
      }
    ],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: PATENT_DATA_SCHEMA
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("No response from Gemini");

  return JSON.parse(resultText) as PatentData;
};

export const findSimilarPatents = async (title: string, abstract: string): Promise<SimilarPatent[]> => {
  const ai = getClient();

  // Note: We are intentionally NOT using the 'googleSearch' tool here because it prevents the use of 'responseSchema'.
  const prompt = `
    You are a patent search expert.
    List 5 real existing patents that are most similar to the following invention.
    
    Invention Title: "${title}"
    Invention Abstract: "${abstract}"

    For each similar patent found, provide:
    1. Patent Number
    2. Title
    3. Assignee (Applicant) - If unknown, put "Unknown"
    4. A very brief 1-sentence summary of why it is similar in Korean.
    5. An estimated 'inventionLevel' (integer 1-5) based on TRIZ levels.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            patentNumber: { type: Type.STRING },
            title: { type: Type.STRING },
            assignee: { type: Type.STRING },
            summary: { type: Type.STRING },
            inventionLevel: { type: Type.NUMBER }
          },
          required: ["patentNumber", "title", "assignee", "summary", "inventionLevel"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  
  try {
    return JSON.parse(text) as SimilarPatent[];
  } catch (e) {
    console.error("Failed to parse similar patents JSON", text);
    return [];
  }
};

export const generateProductPrototype = async (visualPrompt: string): Promise<string> => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Create a high-quality, photorealistic product prototype image based on this description: ${visualPrompt}. White background, studio lighting.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: '4:3'
      }
    }
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("Failed to generate image.");
};

export const editProductPrototype = async (originalImageBase64: string, editPrompt: string): Promise<string> => {
  const ai = getClient();

  const matches = originalImageBase64.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid image format");
  }
  const mimeType = matches[1];
  const data = matches[2];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: data
          }
        },
        { text: `Edit this image based on the following instruction: ${editPrompt}. Maintain the photorealistic product prototype style.` }
      ]
    },
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("Failed to edit image.");
};
