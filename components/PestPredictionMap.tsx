import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner, ExclamationIcon, CloseIcon, PestIcon, FireIcon, ShieldCheckIcon, LeafIcon } from './IconComponents';
import { getPestInformation, getPestPredictionsForCrop, handleApiError } from '../services/geminiService';
import type { PestInfo, PestOnMap, SoilData, GroundingChunk } from '../types';
import { translations } from '../translations';

interface PestPredictionMapProps {
    soilData: SoilData | null;
    t: (typeof translations)['en-US']['pest'];
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

const riskPulseAnimation: { [key: string]: string } = {
    'High': 'animate-pulse-high',
    'Moderate': 'animate-pulse-moderate',
    'Low': 'animate-pulse-low',
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


export const PestPredictionMap: React.FC<PestPredictionMapProps> = ({ soilData, t }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pests, setPests] = useState<PestOnMapWithCoords[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[] | null>(null);
  
  const [selectedPest, setSelectedPest] = useState<PestInfo | null>(null);
  const [hoveredPest, setHoveredPest] = useState<PestOnMapWithCoords | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingPestInfo, setIsFetchingPestInfo] = useState(false);
  const [pestInfoError, setPestInfoError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
                    setError(t.errorLocation);
                    setStatus('error');
                }
            );
        } else {
            setError(t.errorGeolocation);
            setStatus('error');
        }
    } else {
        setStatus('idle');
    }
  }, [soilData, t]);

  // Accessibility: Handle keyboard events for the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the first focusable element in the modal (the close button)
      setTimeout(() => modalRef.current?.querySelector('button')?.focus(), 100);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);
  
  const fetchPestPredictions = async (latitude: number, longitude: number) => {
    if (!soilData) return;
    try {
        const { pests: fetchedPests, groundingChunks: fetchedChunks } = await getPestPredictionsForCrop(latitude, longitude, soilData.crop);
        const pestsWithCoords = fetchedPests.map((pest, index) => ({
            ...pest,
            id: index,
            // Spread pests in a small radius around the center for better visualization
            lat: (Math.random() - 0.5) * 0.008, 
            lon: (Math.random() - 0.5) * 0.008,
        }));
        setPests(pestsWithCoords);
        setGroundingChunks(fetchedChunks || null);
        setStatus('success');
    } catch (err) {
        const processedError = handleApiError(err);
        setError(processedError.message);
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
        const processedError = handleApiError(err);
        setPestInfoError(processedError.message);
    } finally {
        setIsFetchingPestInfo(false);
    }
  };

  const closeModal = () => {
      setIsModalOpen(false);
  }
  
  const MapView = () => (
    <div className="relative w-full h-full bg-green-100 rounded-lg overflow-hidden border-4 border-white shadow-inner">
        {/* Vector Map Background */}
        <svg width="100%" height="100%" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(113, 168, 126, 0.2)" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#e0f2e8" />
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* User's Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse-location" title={t.yourLocation}></div>
        </div>

        {/* Pest Markers */}
        {pests.map(pest => (
            <div
                key={pest.id}
                className="absolute"
                style={{
                    top: `calc(50% - ${pest.lat * 15000}px)`,
                    left: `calc(50% + ${pest.lon * 15000}px)`,
                }}
            >
                <button 
                    onClick={() => handlePestClick(pest.name)}
                    onMouseEnter={() => setHoveredPest(pest)}
                    onMouseLeave={() => setHoveredPest(null)}
                    onFocus={() => setHoveredPest(pest)}
                    onBlur={() => setHoveredPest(null)}
                    className="transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group focus-visible-ring rounded-full p-2" 
                    aria-label={`${t.getInfoFor} ${pest.name}`}
                >
                    <div className={`w-3 h-3 rounded-full ${riskColors[pest.risk]} ring-2 ring-white`}></div>
                    <div className={`absolute inset-0 rounded-full ${riskPulseAnimation[pest.risk]}`}></div>
                </button>
            </div>
        ))}

        {/* Hover Tooltip */}
        {hoveredPest && (
            <div 
                className="absolute p-2 text-sm font-bold text-white bg-brand-dark rounded-md shadow-lg pointer-events-none transition-opacity duration-200"
                style={{
                    top: `calc(50% - ${hoveredPest.lat * 15000}px - 30px)`,
                    left: `calc(50% + ${hoveredPest.lon * 15000}px)`,
                    transform: 'translateX(-50%)',
                }}
            >
                {hoveredPest.name} - <span className={riskTextColors[hoveredPest.risk]}>{t[hoveredPest.risk.toLowerCase() as 'high' | 'moderate' | 'low']} {t.risk}</span>
            </div>
        )}
    </div>
  );

  const PestInfoModal = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="pest-modal-title">
        <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="p-4 flex items-center justify-between border-b">
                <h3 id="pest-modal-title" className="text-xl font-bold text-brand-dark">{t.modal.title}</h3>
                <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-200 focus-visible-ring" aria-label={t.modal.close}>
                    <CloseIcon className="h-6 w-6 text-slate-600"/>
                </button>
            </header>
            <div className="p-6 overflow-y-auto">
                {isFetchingPestInfo && (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <LoadingSpinner className="h-10 w-10 text-brand-green"/>
                        <p className="mt-4 text-slate-500">{t.modal.loading}</p>
                    </div>
                )}
                {pestInfoError && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600 bg-red-50 p-4 rounded-lg" role="alert">
                        <ExclamationIcon className="h-8 w-8 mb-3"/>
                        <p className="text-base font-medium text-center">{pestInfoError}</p>
                    </div>
                )}
                {selectedPest && (
                    <div className="space-y-6 animate-fade-in">
                        <div className={`p-4 rounded-lg ${riskBgColors[selectedPest.risk]}`}>
                            <div className="flex justify-between items-start">
                                <h4 className="text-2xl font-bold text-slate-900">{selectedPest.name}</h4>
                                <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${riskColors[selectedPest.risk]}`}>{t[selectedPest.risk.toLowerCase() as 'high' | 'moderate' | 'low']} {t.risk}</span>
                            </div>
                            <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{selectedPest.description}</p>
                        </div>
                        <InfoSection icon={<FireIcon className="h-6 w-6 text-red-500"/>} title={t.modal.damage} content={selectedPest.damage} />
                        <InfoSection icon={<ShieldCheckIcon className="h-6 w-6 text-blue-500"/>} title={t.modal.prevention} content={selectedPest.prevention} />
                        <InfoSection icon={<LeafIcon className="h-6 w-6 text-green-500"/>} title={t.modal.organic} content={selectedPest.organicControl} />
                        <InfoSection icon={<PestIcon className="h-6 w-6 text-orange-500"/>} title={t.modal.chemical} content={selectedPest.chemicalControl} />
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const InfoSection = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
      <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-light-gray rounded-full mr-4">
          {icon}
        </div>
        <div>
          <h5 className="font-bold text-brand-dark">{title}</h5>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{content}</p>
        </div>
      </div>
  );

  const renderContent = () => {
    switch (status) {
        case 'idle':
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <PestIcon className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-brand-dark">{t.placeholder.title}</h3>
                    <p className="text-slate-500 mt-2 max-w-md" dangerouslySetInnerHTML={{ __html: t.placeholder.subtitle }} />
                </div>
            );
        case 'loading':
            return (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner className="h-10 w-10 text-brand-green" />
                  <p className="ml-4 text-slate-500">{t.loading(soilData?.crop || '')}</p>
                </div>
            );
        case 'error':
            return (
                <div className="flex items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg" role="alert">
                  <ExclamationIcon className="h-8 w-8 mr-3 flex-shrink-0" />
                  <p className="text-base font-medium">{error}</p>
                </div>
            );
        case 'success':
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    <div className="lg:col-span-2 h-[500px] lg:h-full">
                         <MapView />
                    </div>
                    <div className="lg:col-span-1 h-full flex flex-col">
                        <p className="text-slate-600 mb-4 text-sm flex-shrink-0">
                            {t.success.subtitle(soilData?.crop || '')}
                        </p>
                        <div className="bg-slate-50 rounded-lg p-4 flex-grow overflow-y-auto">
                            <h3 className="font-bold text-brand-dark mb-3">{t.success.listTitle}</h3>
                            <ul className="space-y-2">
                                {pests.map(pest => (
                                    <li key={pest.id}>
                                        <button 
                                            onClick={() => handlePestClick(pest.name)}
                                            className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-slate-100 transition-colors focus-visible-ring text-left"
                                        >
                                            <span className="font-semibold text-slate-800">{pest.name}</span>
                                            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${riskColors[pest.risk]}`}>{t[pest.risk.toLowerCase() as 'high' | 'moderate' | 'low']} {t.risk}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <GroundingSources chunks={groundingChunks} t={t.sources} />
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
      <div className="flex-grow min-h-0">
        {renderContent()}
      </div>
      {isModalOpen && <PestInfoModal />}
    </div>
  );
};