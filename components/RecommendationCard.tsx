

// FIX: Corrected import statement for React and its hooks.
import React, { useState, useEffect } from 'react';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData, WeatherAdvisoryData, PestOnMap, GroundingChunk } from '../types';
import { getWeatherAdvisory, getPestPredictionsForCrop } from '../services/geminiService';
import { LogoIcon, InfoIcon, BeakerIcon, DollarIcon, EcoIcon, ResetIcon, ExportIcon, ReportIcon, LayersIcon, BrainCircuitIcon, ChevronDownIcon, YieldIcon, WeatherIcon, PestIcon, LoadingSpinner, ExclamationIcon, ShoppingCartIcon } from './IconComponents';

interface RecommendationCardProps {
  analysisResult: AnalysisResult | null;
  soilData: SoilData | null;
  recommendation: FertilizerRecommendation | null;
  prediction: YieldPredictionData | null;
  yieldSources: GroundingChunk[] | null;
  onReset: () => void;
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

const AccordionSection = ({ title, icon, children, defaultOpen = false }: React.PropsWithChildren<{ title: string, icon: React.ReactNode, defaultOpen?: boolean }>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <h3 className="text-xl font-bold text-brand-dark">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left py-4 no-print"
          aria-expanded={isOpen}
        >
          <span className="flex items-center">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-light-gray rounded-full">
              {icon}
            </span>
            <span className="ml-4">{title}</span>
          </span>
          <ChevronDownIcon className={`h-6 w-6 text-slate-500 transition-transform duration-300 printable-accordion-chevron ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <div
        className={`grid transition-all duration-500 ease-in-out printable-accordion-content ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="pl-4 sm:pl-14 pt-2 pb-6 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoPill = ({ label, value, color = 'bg-slate-100 text-slate-800' }: { label: string, value: string, color?: string }) => (
    <div className={`p-4 rounded-lg ${color}`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-lg font-bold break-all">{value}</p>
    </div>
);

const CompleteReportPrompt = () => (
    <div className="border-t border-slate-200 mt-4 pt-4">
        <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg flex items-start text-left shadow-sm">
            <BeakerIcon className="h-10 w-10 text-brand-brown mr-4 flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-lg text-brand-dark">Unlock Your Full Agro-Report</h4>
                <p className="text-sm text-slate-700 mt-1">
                    Your leaf analysis is complete. To generate personalized recommendations, please provide your soil and crop data on the <strong>Analytics Dashboard</strong>.
                </p>
                <p className="text-sm text-slate-700 mt-3">You will unlock:</p>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700 space-y-1">
                    <li>A precise, weather-aware Fertilizer Plan</li>
                    <li>An economic breakdown and sustainability score</li>
                    <li>A data-driven Yield Forecast</li>
                    <li>Hyperlocal Pest & Weather Advisories</li>
                </ul>
            </div>
        </div>
    </div>
);


export const RecommendationCard: React.FC<RecommendationCardProps> = ({ analysisResult, soilData, recommendation, prediction, yieldSources, onReset }) => {
    const [weatherAdvisory, setWeatherAdvisory] = useState<WeatherAdvisoryData | null>(null);
    const [pestPredictions, setPestPredictions] = useState<PestOnMap[] | null>(null);
    const [isExtraDataLoading, setIsExtraDataLoading] = useState(false);
    const [extraDataError, setExtraDataError] = useState<string | null>(null);

    useEffect(() => {
      if (soilData) {
        setIsExtraDataLoading(true);
        setExtraDataError(null);
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const [weatherRes, pestsRes] = await Promise.all([
                getWeatherAdvisory(latitude, longitude, soilData.crop),
                getPestPredictionsForCrop(latitude, longitude, soilData.crop)
              ]);
              setWeatherAdvisory(weatherRes.advisory);
              setPestPredictions(pestsRes.pests);
            } catch (err) {
              console.error(err);
              let errorMessage = "Could not load supplementary advisory data. The core report is still available.";
              if (err instanceof Error) {
                const lowerCaseMessage = err.message.toLowerCase();
                if (lowerCaseMessage.includes('entity was not found')) {
                  errorMessage = "Invalid API Key. Supplementary data could not be loaded.";
                } else if (err.message.includes('429') || lowerCaseMessage.includes('quota')) {
                  errorMessage = "Rate limit reached. Supplementary data could not be loaded.";
                }
              }
              setExtraDataError(errorMessage);
            } finally {
              setIsExtraDataLoading(false);
            }
          },
          (error) => {
            console.error(error);
            setExtraDataError("Location access denied. Weather and pest advisories cannot be loaded.");
            setIsExtraDataLoading(false);
          }
        );
      } else {
          setWeatherAdvisory(null);
          setPestPredictions(null);
          setIsExtraDataLoading(false);
      }
    }, [soilData]);

    if (!analysisResult) {
    const Feature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
      <div className="flex items-start text-left">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-light-gray rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-brand-dark">{title}</h4>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    );

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <ReportIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-brand-dark">Your Comprehensive Agro-Report</h3>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Generate a report to unlock a detailed analysis of your crop's health. Here's what you'll get:
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 w-full max-w-6xl">
          <Feature
            icon={<LogoIcon className="h-7 w-7 text-brand-green" />}
            title="Disease Detection"
            description="AI-powered analysis of leaf photos to identify diseases and estimate severity."
          />
          <Feature
            icon={<BeakerIcon className="h-7 w-7 text-brand-brown" />}
            title="Fertilizer Plan"
            description="Precise nutrient recommendations (kg/ha) based on soil data and crop type."
          />
          <Feature
            icon={<YieldIcon className="h-7 w-7 text-indigo-500" />}
            title="Yield Forecasting"
            description="Predicts potential yield and identifies factors that might be limiting it."
          />
          <Feature
            icon={<WeatherIcon className="h-7 w-7 text-blue-500" />}
            title="Weather Advisory"
            description="Actionable farming advice based on a 3-day hyperlocal weather forecast."
          />
          <Feature
            icon={<PestIcon className="h-7 w-7 text-orange-500" />}
            title="Pest Prediction"
            description="Identifies likely pest threats in your area for proactive treatment."
          />
           <Feature
            icon={<DollarIcon className="h-7 w-7 text-green-600" />}
            title="Economics & Sustainability"
            description="Estimates costs, provides eco-friendly advice, and suggests purchase options."
          />
        </div>
      </div>
    );
  }

  const riskColors: { [key: string]: string } = {
    'High': 'bg-red-500',
    'Moderate': 'bg-yellow-400',
    'Low': 'bg-green-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 h-full agro-report-container">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-2 no-print">
        <h2 className="text-2xl font-bold text-brand-dark">Agro-Report</h2>
        <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-green transition-colors"
            >
              <ExportIcon className="h-4 w-4 mr-2"/>
              Export to PDF
            </button>
            <button 
              onClick={onReset}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-green transition-colors"
            >
              <ResetIcon className="h-4 w-4 mr-2"/>
              Start New Report
            </button>
        </div>
      </header>
      
      <div className="w-full">
         {analysisResult && (
            <AccordionSection title="Disease Detection" icon={<LogoIcon className="h-6 w-6 text-brand-green" />} defaultOpen>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoPill label="Diagnosis" value={analysisResult.diagnosis} color="bg-green-50 text-green-900" />
                  <InfoPill label="Confidence" value={`${(analysisResult.confidence * 100).toFixed(1)}%`} color="bg-yellow-50 text-yellow-900" />
                  <InfoPill label="Severity" value={analysisResult.severity} color="bg-red-50 text-red-900" />
                  <InfoPill label="Infected Area" value={`${(analysisResult.infectedAreaPercent || 0).toFixed(1)}%`} color="bg-purple-50 text-purple-900" />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="min-w-0">
                      <h4 className="font-semibold text-slate-700">Chemical Treatment</h4>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{analysisResult.chemicalTreatment}</p>
                  </div>
                  <div className="min-w-0">
                      <h4 className="font-semibold text-slate-700">Organic Treatment</h4>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{analysisResult.organicTreatment}</p>
                  </div>
              </div>
            </AccordionSection>
          )}

        {(analysisResult || recommendation) && (
            <AccordionSection title="AI Reasoning" icon={<BrainCircuitIcon className="h-6 w-6 text-purple-500" />}>
                <div className="space-y-4">
                    {analysisResult && (
                        <div>
                            <h4 className="font-semibold text-slate-700">Disease Diagnosis Explanation</h4>
                            <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{analysisResult.explanation}</blockquote>
                        </div>
                    )}
                    {recommendation && (
                        <div>
                            <h4 className="font-semibold text-slate-700">Fertilizer Recommendation Rationale</h4>
                            <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{recommendation.reasoning}</blockquote>
                        </div>
                    )}
                </div>
            </AccordionSection>
        )}
          
        {!recommendation && <CompleteReportPrompt />}

        {prediction && (
        <AccordionSection title="Yield Forecasting" icon={<YieldIcon className="h-6 w-6 text-indigo-500" />}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoPill label="Baseline Potential" value={`${prediction.expectedYield.toFixed(2)} ${prediction.yieldUnit}`} color="bg-green-50 text-green-900" />
                    <InfoPill label="Potential Loss" value={`${prediction.potentialLossPercent.toFixed(1)}%`} color="bg-red-50 text-red-900" />
                    <InfoPill label="Forecasted Net Yield" value={`${(prediction.expectedYield * (1 - prediction.potentialLossPercent / 100)).toFixed(2)} ${prediction.yieldUnit}`} color="bg-blue-50 text-blue-900" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Reason for Potential Loss</h4>
                    <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{prediction.lossReason}</blockquote>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Mitigation Advice</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 space-y-1">
                        {prediction.mitigationAdvice.map((advice, i) => <li key={i}>{advice}</li>)}
                    </ul>
                </div>
                <GroundingSources chunks={yieldSources} />
            </div>
        </AccordionSection>
        )}

        {soilData && recommendation && (
            <AccordionSection title="Fertilizer Plan" icon={<BeakerIcon className="h-6 w-6 text-brand-brown" />}>
            <p className="text-sm text-slate-600 -mt-2 mb-4">Precise nutrient recommendations (kg/ha) based on soil data and crop type.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoPill label="Crop Type" value={soilData.crop} />
                <InfoPill label="Field Area" value={`${soilData.area} ha`} />
                <InfoPill label="Soil pH" value={String(soilData.ph)} />
                <InfoPill label="Nitrogen (N)" value={`${soilData.n} ppm`} />
                <InfoPill label="Phosphorus (P)" value={`${soilData.p} ppm`} />
                <InfoPill label="Potassium (K)" value={`${soilData.k} ppm`} />
                <InfoPill label="Sulphur (S)" value={`${soilData.s} ppm`} />
                <InfoPill label="Zinc (Zn)" value={`${soilData.zn} ppm`} />
            </div>
            <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Nutrient Rate (per Hectare)</h4>
                    <ul className="text-sm space-y-2">
                        <li className="flex justify-between"><span>Nitrogen (N):</span> <span className="font-bold">{recommendation.nutrientAmounts.n.toFixed(2)} kg/ha</span></li>
                        <li className="flex justify-between"><span>Phosphorus (P):</span> <span className="font-bold">{recommendation.nutrientAmounts.p.toFixed(2)} kg/ha</span></li>
                        <li className="flex justify-between"><span>Potassium (K):</span> <span className="font-bold">{recommendation.nutrientAmounts.k.toFixed(2)} kg/ha</span></li>
                        <li className="flex justify-between"><span>Sulphur (S):</span> <span className="font-bold">{recommendation.nutrientAmounts.s.toFixed(2)} kg/ha</span></li>
                        <li className="flex justify-between"><span>Zinc (Zn):</span> <span className="font-bold">{recommendation.nutrientAmounts.zn.toFixed(2)} kg/ha</span></li>
                        <li className="flex justify-between"><span>Iron (Fe):</span> <span className="font-bold">{recommendation.nutrientAmounts.fe.toFixed(2)} kg/ha</span></li>
                    </ul>
                    </div>
                    <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Total for {soilData.area} ha (Auto-Scaled)</h4>
                    <ul className="text-sm space-y-2">
                        <li className="flex justify-between"><span>Nitrogen (N):</span> <span className="font-bold">{recommendation.totalFertilizer.n.toFixed(2)} kg</span></li>
                        <li className="flex justify-between"><span>Phosphorus (P):</span> <span className="font-bold">{recommendation.totalFertilizer.p.toFixed(2)} kg</span></li>
                        <li className="flex justify-between"><span>Potassium (K):</span> <span className="font-bold">{recommendation.totalFertilizer.k.toFixed(2)} kg</span></li>
                        <li className="flex justify-between"><span>Sulphur (S):</span> <span className="font-bold">{recommendation.totalFertilizer.s.toFixed(2)} kg</span></li>
                        <li className="flex justify-between"><span>Zinc (Zn):</span> <span className="font-bold">{recommendation.totalFertilizer.zn.toFixed(2)} kg</span></li>
                        <li className="flex justify-between"><span>Iron (Fe):</span> <span className="font-bold">{recommendation.totalFertilizer.fe.toFixed(2)} kg</span></li>
                    </ul>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Disease–Fertilizer Integration</h4>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.diseaseIntegrationExplanation}</p>
                </div>
                {recommendation.weatherIntegrationExplanation && (
                    <div>
                        <h4 className="font-semibold text-slate-700">Weather-Aware Adjustment</h4>
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.weatherIntegrationExplanation}</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-700">Application Schedule</h4>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.applicationSchedule}</p>
                </div>
            </div>
            </AccordionSection>
        )}

        {isExtraDataLoading && recommendation && (
        <div className="flex items-center justify-center p-6 text-slate-500">
            <LoadingSpinner className="h-6 w-6 text-brand-green" />
            <span className="ml-3">Loading weather and pest advisories...</span>
        </div>
        )}
        {extraDataError && recommendation && (
            <div className="flex items-center justify-center p-6 text-red-600 bg-red-50 rounded-lg">
            <ExclamationIcon className="h-6 w-6 mr-3" />
            <span>{extraDataError}</span>
        </div>
        )}

        {!isExtraDataLoading && !extraDataError && weatherAdvisory && (
            <AccordionSection title="Weather Advisory" icon={<WeatherIcon className="h-6 w-6 text-blue-500" />}>
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 text-blue-800 italic break-all">
                {weatherAdvisory.summary}
            </blockquote>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <InfoPill label="Temperature" value={weatherAdvisory.temperature} />
                <InfoPill label="Precipitation" value={weatherAdvisory.precipitation} />
                <InfoPill label="Wind" value={weatherAdvisory.wind} />
            </div>
                <div className="mt-4">
                <h4 className="font-semibold text-slate-700">Potential Crop Impact</h4>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{weatherAdvisory.impact}</p>
            </div>
                <div className="mt-4">
                <h4 className="font-semibold text-slate-700">Recommendations</h4>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 space-y-1">
                    <li className="break-all"><strong>Irrigation:</strong> {weatherAdvisory.recommendations.irrigation}</li>
                    <li className="break-all"><strong>Fertilizer:</strong> {weatherAdvisory.recommendations.fertilizer}</li>
                    <li className="break-all"><strong>Pesticide:</strong> {weatherAdvisory.recommendations.pesticide}</li>
                </ul>
            </div>
            </AccordionSection>
        )}

        {!isExtraDataLoading && !extraDataError && pestPredictions && pestPredictions.length > 0 && (
            <AccordionSection title="Pest Prediction" icon={<PestIcon className="h-6 w-6 text-orange-500" />}>
            <p className="text-sm text-slate-600 mb-3">Top 5 potential pest threats for {soilData?.crop} in your region, based on current conditions. Monitor crops for these pests.</p>
            <ul className="space-y-2">
                {pestPredictions.map(pest => (
                    <li key={pest.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-semibold text-slate-800">{pest.name}</span>
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${riskColors[pest.risk]}`}>{pest.risk} Risk</span>
                    </li>
                ))}
            </ul>
            </AccordionSection>
        )}

      </div>
    </div>
  );
};