
import React, { useState, useEffect } from 'react';
import type { AnalysisResult, SoilData, YieldPredictionData, GroundingChunk } from '../types';
import { getYieldPrediction } from '../services/geminiService';
import { LoadingSpinner, ExclamationIcon, InfoIcon, YieldIcon, CheckCircleIcon } from './IconComponents';

interface YieldPredictorProps {
  analysisResult: AnalysisResult | null;
  soilData: SoilData | null;
  prediction: YieldPredictionData | null;
  setPrediction: (pred: YieldPredictionData | null) => void;
  yieldSources: GroundingChunk[] | null;
}

const GroundingSources: React.FC<{ chunks: GroundingChunk[] | undefined | null; }> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) {
    return null;
  }

  const validChunks = chunks.filter(chunk => chunk.maps || chunk.web);

  if (validChunks.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h5 className="text-sm font-semibold text-slate-600 mb-2">Data Sources from Google</h5>
      <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
        {validChunks.map((chunk, index) => {
          const source = chunk.maps || chunk.web;
          if (!source || !source.uri) return null;
          return (
            <li key={index}>
              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 break-all">
                {source.title || 'Source link'}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type Status = 'idle' | 'loading' | 'error' | 'success';

export const YieldPredictor: React.FC<YieldPredictorProps> = ({ analysisResult, soilData, prediction, setPrediction, yieldSources }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (analysisResult && soilData) {
        setStatus('loading');
        setError(null);
        // This component doesn't have direct access to lat/lon, 
        // it relies on the prediction being passed in from App state,
        // which is fetched in SoilInputCard.
        // We add this check to avoid re-fetching if data is already present.
        if (prediction) {
             setStatus('success');
             return;
        }

        // The call below will not work as lat/lon is not available here.
        // The logic is centralized in SoilInputCard for a better UX.
        // This component is primarily for displaying the data.
        setStatus('idle'); // Revert to idle if prediction is missing
      } else {
        setStatus('idle');
        setPrediction(null);
      }
    };

    if (prediction && analysisResult?.diagnosis && prediction.lossReason.includes(analysisResult.diagnosis)) {
      setStatus('success');
    } else {
      fetchPrediction();
    }
  }, [analysisResult, soilData, prediction, setPrediction]);

  if (status === 'idle') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <InfoIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-brand-dark">Yield Predictor</h3>
          <p className="text-slate-500 mt-2 max-w-md">
            Complete an analysis on the "Analytics Dashboard" first. This tool uses your leaf and soil data to forecast crop yield and potential losses.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <LoadingSpinner className="h-10 w-10 text-brand-green" />
        <p className="ml-4 text-slate-500">Calculating yield potential...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
       <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
            <ExclamationIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Error Predicting Yield</h3>
            <p className="mt-2 text-sm">{error}</p>
        </div>
       </div>
    );
  }
  
  if (status === 'success' && prediction) {
      const netYield = prediction.expectedYield * (1 - prediction.potentialLossPercent / 100);
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full">
         <header className="flex items-center mb-6">
            <YieldIcon className="h-8 w-8 text-brand-green" />
            <h2 className="ml-3 text-2xl font-bold text-brand-dark">Yield Prediction for {prediction.crop}</h2>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoPill label="Baseline Potential Yield" value={`${prediction.expectedYield.toFixed(2)} ${prediction.yieldUnit}`} color="bg-green-50 text-green-900" />
            <InfoPill label="Potential Loss" value={`${prediction.potentialLossPercent.toFixed(1)}%`} color="bg-red-50 text-red-900" />
            <InfoPill label="Forecasted Net Yield" value={`${netYield.toFixed(2)} ${prediction.yieldUnit}`} color="bg-blue-50 text-blue-900" />
         </div>

         <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-dark mb-2">Reason for Potential Loss</h3>
            <blockquote className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 text-yellow-900 text-sm">
                {prediction.lossReason || "No significant loss detected. Crop appears healthy."}
            </blockquote>
         </div>

         <div className="mb-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-2">How to Mitigate Loss & Maximize Yield</h3>
            <ul className="space-y-3">
                {prediction.mitigationAdvice.map((advice, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{advice}</span>
                    </li>
                ))}
            </ul>
         </div>
        
         <GroundingSources chunks={yieldSources} />

      </div>
    );
  }

  return null;
};

const InfoPill = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className={`p-4 rounded-lg ${color}`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);