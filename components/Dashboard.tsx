import React from 'react';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData } from '../types';
import { LeafAnalysisCard } from './LeafAnalysisCard';
import { SoilInputCard } from './SoilInputCard';
import { translations } from '../translations';

interface DashboardProps {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setSoilData: (data: SoilData | null) => void;
  setRecommendation: (rec: FertilizerRecommendation | null) => void;
  setPrediction: (pred: YieldPredictionData | null) => void;
  setYieldSources: (sources: any[] | null) => void;
  onAnalysisComplete: () => void;
  t: (typeof translations)['en-US']['dashboard'];
}

export const Dashboard: React.FC<DashboardProps> = ({
  analysisResult,
  setAnalysisResult,
  setSoilData,
  setRecommendation,
  setPrediction,
  setYieldSources,
  onAnalysisComplete,
  t
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <LeafAnalysisCard 
        setAnalysisResult={setAnalysisResult}
        setRecommendation={setRecommendation}
        setPrediction={setPrediction}
        setYieldSources={setYieldSources}
        t={t.leafAnalysis}
      />
      <SoilInputCard 
        setSoilData={setSoilData} 
        analysisResult={analysisResult} 
        setRecommendation={setRecommendation}
        setPrediction={setPrediction}
        setYieldSources={setYieldSources}
        onSuccess={onAnalysisComplete}
        t={t.soilInput}
      />
    </div>
  );
};
