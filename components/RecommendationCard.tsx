import React, { useState, useEffect } from 'react';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData, WeatherAdvisoryData, PestOnMap, GroundingChunk } from '../types';
import { getWeatherAdvisory, getPestPredictionsForCrop, handleApiError } from '../services/geminiService';
import { LogoIcon, InfoIcon, BeakerIcon, DollarIcon, EcoIcon, ResetIcon, ExportIcon, ReportIcon, LayersIcon, BrainCircuitIcon, ChevronDownIcon, YieldIcon, WeatherIcon, PestIcon, LoadingSpinner, ExclamationIcon, ShoppingCartIcon } from './IconComponents';
import { translations } from '../translations';

interface RecommendationCardProps {
  analysisResult: AnalysisResult | null;
  soilData: SoilData | null;
  recommendation: FertilizerRecommendation | null;
  prediction: YieldPredictionData | null;
  yieldSources: GroundingChunk[] | null;
  onReset: () => void;
  t: (typeof translations)['en-US']['report'];
}

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

const AccordionSection = ({ title, icon, children, defaultOpen = false }: React.PropsWithChildren<{ title: string, icon: React.ReactNode, defaultOpen?: boolean }>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <h3 className="text-xl font-bold text-brand-dark">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left py-4 no-print focus-visible-ring rounded-lg"
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
          <div className="pl-4 sm:pl-14 pt-2 pb-6 space-y-4 bg-slate-50/50 rounded-b-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoPill = ({ label, value, color = 'bg-slate-100 text-slate-800' }: { label: string, value: string, color?: string }) => (
    <div className={`p-4 rounded-lg ${color} h-full flex flex-col justify-center`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-lg font-bold break-all">{value}</p>
    </div>
);

const InfectedAreaPill = ({ percentage, severity, t }: { percentage: number, severity: 'Mild' | 'Moderate' | 'Severe' | 'Unknown', t: (typeof translations)['en-US']['report']['infectedArea'] }) => {
    const size = 80;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const severityStyles = {
        'Mild': { stroke: 'stroke-yellow-400', text: 'text-yellow-600' },
        'Moderate': { stroke: 'stroke-orange-500', text: 'text-orange-600' },
        'Severe': { stroke: 'stroke-red-600', text: 'text-red-700' },
        'Unknown': { stroke: 'stroke-slate-500', text: 'text-slate-500' }
    }[severity];

    return (
        <div className="p-4 rounded-lg bg-purple-50 text-purple-900 flex flex-col items-center justify-center text-center h-full">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        className="donut-chart-bg"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        className={`donut-chart-fg ${severityStyles.stroke}`}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                    />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <p className="text-sm font-medium mt-2 opacity-80">{t.title}</p>
            <p className={`text-sm font-bold mt-1 ${severityStyles.text}`}>
                {t[severity.toLowerCase() as keyof typeof t]}
            </p>
        </div>
    );
};

const CompleteReportPrompt = ({ t }: { t: (typeof translations)['en-US']['report']['completePrompt'] }) => (
    <div className="border-t border-slate-200 mt-4 pt-4">
        <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg flex items-start text-left shadow-sm">
            <BeakerIcon className="h-10 w-10 text-brand-brown mr-4 flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-lg text-brand-dark">{t.title}</h4>
                <p className="text-sm text-slate-700 mt-1" dangerouslySetInnerHTML={{ __html: t.subtitle }} />
                <p className="text-sm text-slate-700 mt-3">{t.unlocksTitle}</p>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700 space-y-1">
                    {t.unlocksItems.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
        </div>
    </div>
);


export const RecommendationCard: React.FC<RecommendationCardProps> = ({ analysisResult, soilData, recommendation, prediction, yieldSources, onReset, t }) => {
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
              const processedError = handleApiError(err);
              console.error(processedError);
              setExtraDataError(t.errorExtraData + processedError.message);
            } finally {
              setIsExtraDataLoading(false);
            }
          },
          (error) => {
            console.error(error);
            setExtraDataError(t.errorLocation);
            setIsExtraDataLoading(false);
          }
        );
      } else {
          setWeatherAdvisory(null);
          setPestPredictions(null);
          setIsExtraDataLoading(false);
      }
    }, [soilData, t]);

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
          <h3 className="text-2xl font-bold text-brand-dark">{t.placeholder.title}</h3>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            {t.placeholder.subtitle}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 w-full max-w-6xl">
          <Feature
            icon={<LogoIcon className="h-7 w-7 text-brand-green" />}
            title={t.placeholder.features.disease.title}
            description={t.placeholder.features.disease.description}
          />
          <Feature
            icon={<BeakerIcon className="h-7 w-7 text-brand-brown" />}
            title={t.placeholder.features.fertilizer.title}
            description={t.placeholder.features.fertilizer.description}
          />
          <Feature
            icon={<YieldIcon className="h-7 w-7 text-indigo-500" />}
            title={t.placeholder.features.yield.title}
            description={t.placeholder.features.yield.description}
          />
          <Feature
            icon={<WeatherIcon className="h-7 w-7 text-blue-500" />}
            title={t.placeholder.features.weather.title}
            description={t.placeholder.features.weather.description}
          />
          <Feature
            icon={<PestIcon className="h-7 w-7 text-orange-500" />}
            title={t.placeholder.features.pest.title}
            description={t.placeholder.features.pest.description}
          />
           <Feature
            icon={<DollarIcon className="h-7 w-7 text-green-600" />}
            title={t.placeholder.features.econ.title}
            description={t.placeholder.features.econ.description}
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
        <h2 className="text-2xl font-bold text-brand-dark">{t.title}</h2>
        <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-green transition-colors focus-visible-ring rounded-md p-1"
              aria-label={t.exportAriaLabel}
            >
              <ExportIcon className="h-4 w-4 mr-2"/>
              {t.exportButton}
            </button>
            <button 
              onClick={onReset}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-brand-green transition-colors focus-visible-ring rounded-md p-1"
              aria-label={t.newReportAriaLabel}
            >
              <ResetIcon className="h-4 w-4 mr-2"/>
              {t.newReportButton}
            </button>
        </div>
      </header>
      
      <div className="w-full">
         {analysisResult && (
            <AccordionSection title={t.disease.title} icon={<LogoIcon className="h-6 w-6 text-brand-green" />} defaultOpen>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoPill label={t.disease.diagnosis} value={analysisResult.diagnosis} color="bg-green-50 text-green-900" />
                  <InfoPill label={t.disease.confidence} value={`${(analysisResult.confidence * 100).toFixed(1)}%`} color="bg-yellow-50 text-yellow-900" />
                  <InfoPill label={t.disease.severity} value={t.infectedArea[analysisResult.severity.toLowerCase() as keyof typeof t.infectedArea]} color="bg-red-50 text-red-900" />
                  <InfectedAreaPill percentage={analysisResult.infectedAreaPercent || 0} severity={analysisResult.severity} t={t.infectedArea} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="min-w-0">
                      <h4 className="font-semibold text-slate-700">{t.disease.chemical}</h4>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{analysisResult.chemicalTreatment}</p>
                  </div>
                  <div className="min-w-0">
                      <h4 className="font-semibold text-slate-700">{t.disease.organic}</h4>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{analysisResult.organicTreatment}</p>
                  </div>
              </div>
            </AccordionSection>
          )}

        {(analysisResult || recommendation) && (
            <AccordionSection title={t.reasoning.title} icon={<BrainCircuitIcon className="h-6 w-6 text-purple-500" />}>
                <div className="space-y-4">
                    {analysisResult && (
                        <div>
                            <h4 className="font-semibold text-slate-700">{t.reasoning.disease}</h4>
                            <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{analysisResult.explanation}</blockquote>
                        </div>
                    )}
                    {recommendation && (
                        <div>
                            <h4 className="font-semibold text-slate-700">{t.reasoning.fertilizer}</h4>
                            <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{recommendation.reasoning}</blockquote>
                        </div>
                    )}
                </div>
            </AccordionSection>
        )}
          
        {!recommendation && <CompleteReportPrompt t={t.completePrompt} />}

        {prediction && (
        <AccordionSection title={t.yield.title} icon={<YieldIcon className="h-6 w-6 text-indigo-500" />}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoPill label={t.yield.baseline} value={`${prediction.expectedYield.toFixed(2)} ${prediction.yieldUnit}`} color="bg-green-50 text-green-900" />
                    <InfoPill label={t.yield.loss} value={`${prediction.potentialLossPercent.toFixed(1)}%`} color="bg-red-50 text-red-900" />
                    <InfoPill label={t.yield.net} value={`${(prediction.expectedYield * (1 - prediction.potentialLossPercent / 100)).toFixed(2)} ${prediction.yieldUnit}`} color="bg-blue-50 text-blue-900" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">{t.yield.reason}</h4>
                    <blockquote className="text-sm text-slate-600 mt-1 border-l-4 border-slate-200 pl-4 py-1 whitespace-pre-wrap break-all">{prediction.lossReason}</blockquote>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">{t.yield.advice}</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 space-y-1">
                        {prediction.mitigationAdvice.map((advice, i) => <li key={i}>{advice}</li>)}
                    </ul>
                </div>
                <GroundingSources chunks={yieldSources} t={t.sources} />
            </div>
        </AccordionSection>
        )}

        {soilData && recommendation && (
            <AccordionSection title={t.fertilizer.title} icon={<BeakerIcon className="h-6 w-6 text-brand-brown" />}>
            <p className="text-sm text-slate-600 -mt-2 mb-4">{t.fertilizer.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoPill label={t.fertilizer.crop} value={soilData.crop} />
                <InfoPill label={t.fertilizer.area} value={`${soilData.area} ha`} />
                <InfoPill label={t.fertilizer.ph} value={String(soilData.ph)} />
                <InfoPill label="Nitrogen (N)" value={`${soilData.n} ppm`} />
                <InfoPill label="Phosphorus (P)" value={`${soilData.p} ppm`} />
                <InfoPill label="Potassium (K)" value={`${soilData.k} ppm`} />
                <InfoPill label="Sulphur (S)" value={`${soilData.s} ppm`} />
                <InfoPill label="Zinc (Zn)" value={`${soilData.zn} ppm`} />
            </div>
            <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <h4 className="font-semibold text-slate-700 mb-2">{t.fertilizer.rate}</h4>
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
                    <h4 className="font-semibold text-slate-700 mb-2">{t.fertilizer.total(soilData.area)}</h4>
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
                    <h4 className="font-semibold text-slate-700">{t.fertilizer.integration}</h4>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.diseaseIntegrationExplanation}</p>
                </div>
                {recommendation.weatherIntegrationExplanation && (
                    <div>
                        <h4 className="font-semibold text-slate-700">{t.fertilizer.weather}</h4>
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.weatherIntegrationExplanation}</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-700">{t.fertilizer.schedule}</h4>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{recommendation.applicationSchedule}</p>
                </div>
            </div>
            </AccordionSection>
        )}

        {isExtraDataLoading && recommendation && (
        <div className="flex items-center justify-center p-6 text-slate-500">
            <LoadingSpinner className="h-6 w-6 text-brand-green" />
            <span className="ml-3">{t.loadingAdvisories}</span>
        </div>
        )}
        {extraDataError && recommendation && (
            <div className="flex items-center justify-center p-6 text-red-600 bg-red-50 rounded-lg" role="alert">
            <ExclamationIcon className="h-6 w-6 mr-3" />
            <span>{extraDataError}</span>
        </div>
        )}

        {!isExtraDataLoading && !extraDataError && weatherAdvisory && (
            <AccordionSection title={t.weather.title} icon={<WeatherIcon className="h-6 w-6 text-blue-500" />}>
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 text-blue-800 italic break-all">
                {weatherAdvisory.summary}
            </blockquote>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <InfoPill label={t.weather.temperature} value={weatherAdvisory.temperature} />
                <InfoPill label={t.weather.precipitation} value={weatherAdvisory.precipitation} />
                <InfoPill label={t.weather.wind} value={weatherAdvisory.wind} />
            </div>
                <div className="mt-4">
                <h4 className="font-semibold text-slate-700">{t.weather.impact}</h4>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-all">{weatherAdvisory.impact}</p>
            </div>
                <div className="mt-4">
                <h4 className="font-semibold text-slate-700">{t.weather.recommendations}</h4>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 space-y-1">
                    <li className="break-all"><strong>{t.weather.irrigation}:</strong> {weatherAdvisory.recommendations.irrigation}</li>
                    <li className="break-all"><strong>{t.weather.fertilizerRec}:</strong> {weatherAdvisory.recommendations.fertilizer}</li>
                    <li className="break-all"><strong>{t.weather.pesticide}:</strong> {weatherAdvisory.recommendations.pesticide}</li>
                </ul>
            </div>
            </AccordionSection>
        )}

        {!isExtraDataLoading && !extraDataError && pestPredictions && pestPredictions.length > 0 && (
            <AccordionSection title={t.pest.title} icon={<PestIcon className="h-6 w-6 text-orange-500" />}>
            <p className="text-sm text-slate-600 mb-3">{t.pest.subtitle(soilData?.crop || '')}</p>
            <ul className="space-y-2">
                {pestPredictions.map(pest => (
                    <li key={pest.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-semibold text-slate-800">{pest.name}</span>
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${riskColors[pest.risk]}`}>{t.pest[pest.risk.toLowerCase() as 'high' | 'moderate' | 'low']} {t.pest.risk}</span>
                    </li>
                ))}
            </ul>
            </AccordionSection>
        )}

      </div>
    </div>
  );
};