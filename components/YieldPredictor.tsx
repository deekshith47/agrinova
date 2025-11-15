import React from 'react';
import type { AnalysisResult, SoilData, YieldPredictionData, GroundingChunk } from '../types';
import { YieldIcon, CheckCircleIcon } from './IconComponents';
import { translations } from '../translations';

const GroundingSources: React.FC<{ chunks: GroundingChunk[] | undefined | null; t: (typeof translations)['en-US']['report']['sources'] }> = ({ chunks, t }) => {
  if (!chunks || chunks.length === 0) {
    return null;
  }

  const validChunks = chunks.filter(chunk => chunk.maps || chunk.web);

  if (validChunks.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h5 className="text-sm font-semibold text-slate-600 mb-2">{t.title}</h5>
      <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
        {validChunks.map((chunk, index) => {
          const source = chunk.maps || chunk.web;
          if (!source || !source.uri) return null;
          return (
            <li key={index}>
              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 break-all focus-visible-ring" aria-label={`${t.ariaLabel}: ${source.title || t.linkDefault}`}>
                {source.title || t.linkDefault}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const InfoPill = ({ label, value, color = 'bg-slate-100 text-slate-800' }: { label: string, value: string, color?: string }) => (
    <div className={`p-4 rounded-lg ${color} h-full flex flex-col justify-center`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-lg font-bold break-all">{value}</p>
    </div>
);

interface YieldPredictorProps {
  analysisResult: AnalysisResult | null;
  soilData: SoilData | null;
  prediction: YieldPredictionData | null;
  setPrediction: (pred: YieldPredictionData | null) => void;
  yieldSources: GroundingChunk[] | null;
  t: (typeof translations)['en-US']['yield'];
}

export const YieldPredictor: React.FC<YieldPredictorProps> = ({ analysisResult, soilData, prediction, yieldSources, t }) => {
    if (!analysisResult || !soilData) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center max-w-lg">
                    <YieldIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-brand-dark">{t.placeholder.title}</h3>
                    <p className="text-slate-500 mt-2" dangerouslySetInnerHTML={{ __html: t.placeholder.subtitle }} />
                </div>
            </div>
        );
    }
    
    if (!prediction) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center max-w-lg">
                    <CheckCircleIcon className="h-16 w-16 mx-auto text-brand-green mb-4" />
                    <h3 className="text-2xl font-bold text-brand-dark">{t.ready.title}</h3>
                    <p className="text-slate-500 mt-2">{t.ready.subtitle}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoPill label={t.baseline} value={`${prediction.expectedYield.toFixed(2)} ${prediction.yieldUnit}`} color="bg-green-50 text-green-900" />
                    <InfoPill label={t.loss} value={`${prediction.potentialLossPercent.toFixed(1)}%`} color="bg-red-50 text-red-900" />
                    <InfoPill label={t.net} value={`${(prediction.expectedYield * (1 - prediction.potentialLossPercent / 100)).toFixed(2)} ${prediction.yieldUnit}`} color="bg-blue-50 text-blue-900" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">{t.reason}</h4>
                    <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{prediction.lossReason}</blockquote>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">{t.advice}</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 space-y-1">
                        {prediction.mitigationAdvice.map((advice, i) => <li key={i}>{advice}</li>)}
                    </ul>
                </div>
                <GroundingSources chunks={yieldSources} t={t.sources} />
            </div>
        </div>
    );
};
