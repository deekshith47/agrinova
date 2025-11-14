

import React, { useState, useEffect } from 'react';
import { getWeatherAdvisory } from '../services/geminiService';
import type { WeatherAdvisoryData, SoilData, GroundingChunk } from '../types';
import { LoadingSpinner, ExclamationIcon, InfoIcon, WeatherIcon } from './IconComponents';

type Status = 'loading' | 'error' | 'success' | 'prompt';

interface WeatherAdvisoryProps {
    soilData: SoilData | null;
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

export const WeatherAdvisory: React.FC<WeatherAdvisoryProps> = ({ soilData }) => {
    const [status, setStatus] = useState<Status>('prompt');
    const [error, setError] = useState<string | null>(null);
    const [advisory, setAdvisory] = useState<WeatherAdvisoryData | null>(null);
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[] | null>(null);

    const performFetchAdvisory = () => {
        const crop = soilData?.crop || null;
         if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { advisory: data, groundingChunks: chunks } = await getWeatherAdvisory(position.coords.latitude, position.coords.longitude, crop);
                        setAdvisory(data);
                        setGroundingChunks(chunks || null);
                        setStatus('success');
                    } catch (err) {
                        let errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching advisory.";
                        if (err instanceof Error) {
                            const lowerCaseMessage = err.message.toLowerCase();
                            if (lowerCaseMessage.includes('entity was not found')) {
                                errorMessage = "Your API Key seems invalid. Please check the key and try again.";
                            } else if (err.message.includes('429') || lowerCaseMessage.includes('quota')) {
                                errorMessage = "Too many requests. Please wait a moment and try again.";
                            }
                        }
                        setError(errorMessage);
                        setStatus('error');
                    }
                },
                (error) => {
                    setError("Could not get location. Please enable location services.");
                    setStatus('error');
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setStatus('error');
        }
    }

    const fetchAdvisory = async () => {
        setStatus('loading');
        setError(null);
        performFetchAdvisory();
    };

    const AdvisoryCard = ({ title, content }: { title: string, content: string }) => (
        <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold text-brand-dark">{title}</h4>
            <p className="text-slate-600 text-sm mt-1">{content}</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Weather Advisory</h2>
            
            {status === 'prompt' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <WeatherIcon className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-brand-dark">Get Location-Based Farming Advice</h3>
                    <p className="text-slate-500 mt-2 max-w-md">
                        Allow access to your location for a 3-day forecast. For even better advice, complete an analysis on the dashboard to get recommendations tailored to your specific crop.
                    </p>
                    <button 
                        onClick={fetchAdvisory}
                        className="mt-6 bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Get My Advisory
                    </button>
                </div>
            )}

            {status === 'loading' && (
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner className="h-10 w-10 text-brand-green" />
                    <p className="ml-4 text-slate-500">Analyzing weather data for your location...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded-lg">
                    <ExclamationIcon className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold">Error</h3>
                    <p className="mt-2">{error}</p>
                    <button 
                        onClick={fetchAdvisory}
                        className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {status === 'success' && advisory && (
                <div className="space-y-6">
                     {soilData?.crop && (
                        <div className="bg-green-50 text-green-800 text-sm font-semibold p-3 rounded-lg flex items-center">
                            <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            Personalized advisory for: <span className="font-bold ml-1">{soilData.crop}</span>
                        </div>
                    )}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="font-bold text-blue-900">3-Day Forecast Summary</h3>
                        <p className="text-blue-800 mt-1">{advisory.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoPill label="Temperature" value={advisory.temperature} />
                        <InfoPill label="Precipitation" value={advisory.precipitation} />
                        <InfoPill label="Wind" value={advisory.wind} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-2">Potential Impact on Crops</h3>
                        <p className="text-slate-600 text-sm">{advisory.impact}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-2">Actionable Recommendations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <AdvisoryCard title="Irrigation" content={advisory.recommendations.irrigation} />
                            <AdvisoryCard title="Fertilizer" content={advisory.recommendations.fertilizer} />
                            <AdvisoryCard title="Pesticide / Fungicide" content={advisory.recommendations.pesticide} />
                        </div>
                    </div>
                     <button 
                        onClick={fetchAdvisory}
                        className="w-full mt-4 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Refresh Advisory
                    </button>
                    <GroundingSources chunks={groundingChunks} />
                </div>
            )}
        </div>
    );
};

const InfoPill = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-slate-100 p-3 rounded-lg">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
);