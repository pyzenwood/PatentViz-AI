
import { PatentData, HistoryItem } from '../types';

const STORAGE_KEY = 'patent_viz_history';

export const getRecentAnalyses = (): HistoryItem[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    
    const parsed = JSON.parse(json);
    
    if (!Array.isArray(parsed)) return [];

    // Filter out corrupt items to prevent App crash
    return parsed.filter((item: any) => 
      item && 
      item.id && 
      item.patentData && 
      item.patentData.title && 
      Array.isArray(item.patentData.claims)
    );
  } catch (e) {
    console.error("Failed to load history", e);
    // If corruption is detected, return empty to be safe
    return [];
  }
};

export const saveAnalysis = (fileName: string, patentData: PatentData, prototypeImageUrl: string | null): HistoryItem[] => {
  try {
    const current = getRecentAnalyses();
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      fileName,
      patentData,
      prototypeImageUrl
    };

    // Check for duplicate based on patent number or title to avoid spam
    const filtered = current.filter(item => 
      item.patentData.title !== patentData.title
    );

    // Add to beginning, keep max 5 items to prevent localStorage quota issues with images
    const updated = [newItem, ...filtered].slice(0, 5);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save history - likely quota exceeded", e);
    // Return current state if save fails
    return getRecentAnalyses();
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  const current = getRecentAnalyses();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
