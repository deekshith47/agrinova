

import React, { useState, useEffect } from 'react';
import { LoadingSpinner, ExclamationIcon, CloseIcon, PestIcon } from './IconComponents';
import { getPestInformation, getPestPredictionsForCrop } from '../services/geminiService';
import type { PestInfo, PestOnMap, SoilData, GroundingChunk } from '../types';

interface PestPredictionMapProps {
    soilData: SoilData | null;
}

type Status = 'idle' | 'loading' | 'error' | 'success';

interface PestOnMapWithCoords extends PestOnMap {
    id: number;
    lat: number;
    lon: number;
}

const riskColors: { [key: string]: string } = {
    'High': 'bg-red-500',
    'Moderate': 'bg-yellow-400',
    'Low': 'bg-green-500',
};

const riskTextColors: { [key: string]: string } = {
    'High': 'text-red-600',
    'Moderate': 'text-yellow-600',
    'Low': 'text-green-600',
};

const riskBgColors: { [key: string]: string } = {
    'High': 'bg-red-100',
    'Moderate': 'bg-yellow-100',
    'Low': 'bg-green-100',
};

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


export const PestPredictionMap: React.FC<PestPredictionMapProps> = ({ soilData }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pests, setPests] = useState<PestOnMapWithCoords[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[] | null>(null);
  
  const [selectedPest, setSelectedPest] = useState<PestInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingPestInfo, setIsFetchingPestInfo] = useState(false);
  const [pestInfoError, setPestInfoError] = useState<string | null>(null);

  useEffect(() => {
    if (soilData) {
        setStatus('loading');
        setError(null);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPestPredictions(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    setError("Could not retrieve location. Please enable location services in your browser.");
                    setStatus('error');
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setStatus('error');
        }
    } else {
        setStatus('idle');
    }
  }, [soilData]);
  
  const fetchPestPredictions = async (latitude: number, longitude: number) => {
    if (!soilData) return;
    try {
        const { pests: fetchedPests, groundingChunks: fetchedChunks } = await getPestPredictionsForCrop(latitude, longitude, soilData.crop);
        const pestsWithCoords = fetchedPests.map((pest, index) => ({
            ...pest,
            id: index,
            lat: (Math.random() - 0.5) * 0.005,
            lon: (Math.random() - 0.5) * 0.005,
        }));
        setPests(pestsWithCoords);
        setGroundingChunks(fetchedChunks || null);
        setStatus('success');
    } catch (err) {
        let message = err instanceof Error ? err.message : "Could not fetch pest predictions.";
        if (err instanceof Error) {
            const lowerCaseMessage = err.message.toLowerCase();
            if (lowerCaseMessage.includes('entity was not found')) {
                message = "Your API Key seems invalid. Please check the key and try again.";
            } else if (err.message.includes('429') || lowerCaseMessage.includes('quota')) {
                message = "Too many requests. Please wait a moment and try again.";
            }
        }
        setError(message);
        setStatus('error');
    }
  }

  const handlePestClick = async (pestName: string) => {
    setIsModalOpen(true);
    setIsFetchingPestInfo(true);
    setSelectedPest(null);
    setPestInfoError(null);
    try {
        const info = await getPestInformation(pestName);
        setSelectedPest(info);
    } catch (err) {
        let message = err instanceof Error ? err.message : "Could not fetch pest details.";
        if (err instanceof Error) {
            const lowerCaseMessage = err.message.toLowerCase();
            if (lowerCaseMessage.includes('entity was not found')) {
                message = "Your API Key seems invalid. Please check the key and try again.";
            } else if (err.message.includes('429') || lowerCaseMessage.includes('quota')) {
                message = "Too many requests. Please wait a moment before trying again.";
            }
        }
        setPestInfoError(message);
    } finally {
        setIsFetchingPestInfo(false);
    }
  };

  const closeModal = () => {
      setIsModalOpen(false);
  }
  
  const MapView = () => (
    <div className="relative w-full h-96 bg-green-100 rounded-lg overflow-hidden border-4 border-white shadow-inner">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://www.google.com/maps/vt/data=RfCSdfNZ0LFPrHSm0ublXdzReKgB8_24-i4s_sJ5y5gV6h2EpGZA62t48Im3L2LKb2eFFiO5YJNa3Vw')" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-500/50" title="Your Location"></div>
        </div>
        {pests.map(pest => (
            <button 
                key={pest.id}
                onClick={() => handlePestClick(pest.name)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group" 
                style={{
                    top: `calc(50% - ${pest.lat * 15000}px)`,
                    left: `calc(50% + ${pest.lon * 15000}px)`,
                }}
                aria-label={`Get info for ${pest.name}`}
            >
                <div className={`w-6 h-6 rounded-full opacity-60 ${riskColors[pest.risk]} transition-transform group-hover:scale-125`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${riskColors[pest.risk]} ring-2 ring-white`}></div>
            </button>
        ))}
    </div>
  );

  const Legend = () => (
      <div className="mt-4 bg-white/70 backdrop-blur-sm p-4 rounded-lg flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${color}`}></div>
                <span className="text-sm font-medium text-slate-700">{level} Risk</span>
            </div>
          ))}
      </div>
  )

  const PestInfoModal = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal} role="dialog" aria-modal="true">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex items-center justify-between border-b">
                <h3 className="text-xl font-bold text-brand-dark">Pest Information</h3>
                <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-200" aria-label="Close">
                    <CloseIcon className="h-6 w-6 text-slate-600"/>
                </button>
            </header>
            <div className="p-6 overflow-y-auto">
                {isFetchingPestInfo && (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <LoadingSpinner className="h-10 w-10 text-brand-green"/>
                        <p className="mt-4 text-slate-500">Fetching expert analysis...</p>
                    </div>
                )}
                {pestInfoError && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600 bg-red-50 p-4 rounded-lg">
                        <ExclamationIcon className="h-8 w-8 mb-3"/>
                        <p className="text-base font-medium text-center">{pestInfoError}</p>
                    </div>
                )}
                {selectedPest && (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${riskBgColors[selectedPest.risk]}`}>
                            <h4 className="text-lg font-bold text-slate-900">{selectedPest.name}</h4>
                            <p className={`font-semibold ${riskTextColors[selectedPest.risk]}`}>{selectedPest.risk} Risk</p>
                            <p className="text-sm text-slate-700 mt-2">{selectedPest.description}</p>
                        </div>
                        <InfoSection title="Potential Damage" content={selectedPest.damage} />
                        <InfoSection title="Prevention" content={selectedPest.prevention} />
                        <InfoSection title="Organic Control" content={selectedPest.organicControl} />
                        <InfoSection title="Chemical Control" content={selectedPest.chemicalControl} />
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const InfoSection = ({ title, content }: { title: string, content: string }) => (
      <div>
          <h5 className="font-bold text-brand-dark">{title}</h5>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{content}</p>
      </div>
  );

  const renderContent = () => {
    switch (status) {
        case 'idle':
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <PestIcon className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-brand-dark">Personalized Pest Prediction</h3>
                    <p className="text-slate-500 mt-2 max-w-md">
                        Complete an analysis on the "Analytics Dashboard" first. This map will then use your crop type and location to predict relevant pest risks.
                    </p>
                </div>
            );
        case 'loading':
            return (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner className="h-10 w-10 text-brand-green" />
                  <p className="ml-4 text-slate-500">Fetching location and predicting pests for {soilData?.crop}...</p>
                </div>
            );
        case 'error':
            return (
                <div className="flex items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg">
                  <ExclamationIcon className="h-8 w-8 mr-3 flex-shrink-0" />
                  <p className="text-base font-medium">{error}</p>
                </div>
            );
        case 'success':
            return (
                <div>
                  <p className="text-slate-600 mb-4">
                    AI-powered pest forecast for <span className="font-bold text-brand-dark">{soilData?.crop}</span> in your area. Click an outbreak for control strategies.
                  </p>
                  <MapView />
                  <Legend />
                  <GroundingSources chunks={groundingChunks} />
                </div>
            );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">Pest Prediction Map</h2>
      {renderContent()}
      {isModalOpen && <PestInfoModal />}
    </div>
  );
};