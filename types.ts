
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Unknown';
  infectedAreaPercent: number;
  explanation: string;
  chemicalTreatment: string;
  organicTreatment: string;
}

export enum CropType {
  WHEAT = 'Wheat',
  RICE = 'Rice',
  MAIZE = 'Maize',
  SUGARCANE = 'Sugarcane',
  COTTON = 'Cotton',
  SOYBEAN = 'Soybean',
  MUSTARD = 'Mustard',
  TOMATO = 'Tomato',
  POTATO = 'Potato',
}

export interface SoilData {
  crop: CropType;
  n: number;
  p: number;
  k: number;
  ph: number;
  s: number;
  zn: number;
  fe: number;
  area: number; // in hectares
}

export interface FertilizerRecommendation {
  reasoning: string;
  diseaseIntegrationExplanation: string;
  weatherIntegrationExplanation: string;
  nutrientAmounts: {
    n: number; // kg/ha
    p: number; // kg/ha
    k: number; // kg/ha
    s: number; // kg/ha
    zn: number; // kg/ha
    fe: number; // kg/ha
  };
  totalFertilizer: {
    n: number; // kg
    p: number; // kg
    k: number; // kg
    s: number; // kg
    zn: number; // kg
    fe: number; // kg
  };
  applicationSchedule: string;
  totalCost: number;
  sustainabilityScore: {
    score: number; // out of 100
    feedback: string;
  };
  smartPurchaseLinks: string;
}

export interface WeatherAdvisoryData {
  summary: string;
  temperature: string;
  precipitation: string;
  wind: string;
  impact: string;
  recommendations: {
    irrigation: string;
    fertilizer: string;
    pesticide: string;
  };
}

export interface YieldPredictionData {
  crop: string;
  expectedYield: number; // in tons/hectare
  yieldUnit: 'tons/hectare';
  potentialLossPercent: number;
  lossReason: string;
  mitigationAdvice: string[];
}

export interface CommunityContributor {
    id: number;
    name: string;
    contributions: number;
    credits: number;
}

export interface PestOnMap {
  name: string;
  risk: 'High' | 'Moderate' | 'Low';
}

export interface PestInfo {
  name: string;
  description: string;
  risk: 'High' | 'Moderate' | 'Low';
  damage: string;
  prevention: string;
  organicControl: string;
  chemicalControl: string;
}

export interface FinancialData {
  cropName: string;
  currentPrice: {
    price: number;
    unit: string;
    source: string;
  };
  priceTrend: 'Rising' | 'Stable' | 'Falling';
  marketInsights: string;
  historicalData: { month: string; price: number }[];
  revenueContribution: { crop: string; percentage: number }[];
}

export type FertilizerProduct = 'Urea' | 'SSP' | 'MOP' | 'DAP' | 'Micronutrients';

export interface FertilizerStore {
    name: string;
    lat: number;
    lon: number;
    products: FertilizerProduct[];
    phone: string;
    rating: number;
    reviewCount: number;
}

export interface NearbyStore extends FertilizerStore {
    distance: number;
    mapLink: string;
}