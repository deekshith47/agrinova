import React, { useState, useRef } from 'react';
import { analyzeLeaf, generateHeatmap, handleApiError } from '../services/geminiService';
import type { AnalysisResult, FertilizerRecommendation, YieldPredictionData } from '../types';
import { CameraIcon, LoadingSpinner, ExclamationIcon, LayersIcon } from './IconComponents';
import { translations } from '../translations';


interface LeafAnalysisCardProps {
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setRecommendation: (rec: FertilizerRecommendation | null) => void;
  setPrediction: (pred: YieldPredictionData | null) => void;
  setYieldSources: (sources: any[] | null) => void;
  t: (typeof translations)['en-US']['dashboard']['leafAnalysis'];
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const LeafAnalysisCard: React.FC<LeafAnalysisCardProps> = ({ setAnalysisResult, setRecommendation, setPrediction, setYieldSources, t }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [heatmapPreview, setHeatmapPreview] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setImagePreview(null);
    setHeatmapPreview(null);
    setShowHeatmap(true);
    setImageFile(null);
    setError(null);
    // Clear all related state in the parent component
    setAnalysisResult(null);
    setRecommendation(null);
    setPrediction(null);
    setYieldSources(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetState();
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const performAnalysis = async () => {
    if (!imageFile) {
      setError(t.errorSelectImage);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setHeatmapPreview(null);

    try {
      const base64Image = await blobToBase64(imageFile);
      const result = await analyzeLeaf(base64Image, imageFile.type);
      setAnalysisResult(result);

      // Generate heatmap if a disease is found
      if (result.diagnosis !== 'Healthy') {
        setIsGeneratingHeatmap(true);
        try {
            const heatmapBase64 = await generateHeatmap(base64Image, imageFile.type);
            setHeatmapPreview(`data:image/png;base64,${heatmapBase64}`);
        } catch (heatmapError) {
            console.error("Heatmap generation failed:", heatmapError);
            // Non-critical error, so we don't show it to the user
        } finally {
            setIsGeneratingHeatmap(false);
        }
      }

    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAnalyze = async () => {
    await performAnalysis();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileSelect();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-dark mb-4">{t.title}</h2>
      
      <div 
        onClick={triggerFileSelect} 
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t.uploadAriaLabel}
        className="relative flex-grow flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-green transition-colors text-slate-500 bg-slate-50 focus-visible-ring"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {imagePreview ? (
          <div className="relative w-full h-full p-2">
            <div className="w-full h-full flex items-center justify-center">
                <img src={imagePreview} alt={t.imageAlt} className="max-h-full max-w-full w-auto h-auto object-contain rounded-md" />
                {heatmapPreview && (
                    <img 
                        src={heatmapPreview} 
                        alt={t.heatmapAlt} 
                        className={`absolute top-0 left-0 w-full h-full object-contain rounded-md pointer-events-none transition-opacity duration-300 ${showHeatmap ? 'opacity-100 animate-pulse-heatmap' : 'opacity-0'}`} 
                        aria-hidden={!showHeatmap}
                    />
                )}
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <CameraIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold">{t.uploadPrompt}</p>
            <p className="text-sm">{t.uploadSubprompt}</p>
          </div>
        )}
      </div>

      {imagePreview && heatmapPreview && (
        <div className="mt-4 flex items-center justify-center bg-slate-100 p-2 rounded-lg">
          <label htmlFor="heatmap-toggle" className="flex items-center cursor-pointer p-1 rounded-md focus-visible-ring">
              <LayersIcon className="h-5 w-5 mr-2 text-slate-600"/>
              <span className="mr-3 text-sm font-medium text-slate-700" id="heatmap-label">{t.showInfected}</span>
              <div className="relative">
                  <input 
                    type="checkbox" 
                    id="heatmap-toggle" 
                    className="sr-only" 
                    checked={showHeatmap} 
                    onChange={() => setShowHeatmap(!showHeatmap)} 
                    aria-labelledby="heatmap-label"
                  />
                  <div className="block bg-slate-300 w-10 h-6 rounded-full"></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHeatmap ? 'translate-x-full bg-brand-green' : ''}`}></div>
              </div>
          </label>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!imageFile || isLoading}
        className="w-full mt-4 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center focus-visible-ring"
      >
        {isLoading ? (
            <>
                <LoadingSpinner /> 
                <span className="ml-2">{isGeneratingHeatmap ? t.loadingVisualizing : t.loadingAnalyzing}</span>
            </>
        ): t.analyzeButton}
      </button>

      {error && (
        <div className="mt-4 flex items-start text-red-600 bg-red-50 p-3 rounded-lg" role="alert">
          <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
