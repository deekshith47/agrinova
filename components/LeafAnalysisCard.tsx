import React, { useState, useRef } from 'react';
import { analyzeLeaf, generateHeatmap } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import { CameraIcon, LoadingSpinner, ExclamationIcon, LayersIcon } from './IconComponents';

interface LeafAnalysisCardProps {
  setAnalysisResult: (result: AnalysisResult | null) => void;
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

export const LeafAnalysisCard: React.FC<LeafAnalysisCardProps> = ({ setAnalysisResult }) => {
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
    setAnalysisResult(null);
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
      setError("Please select an image.");
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
      let errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (err instanceof Error) {
        const lowerCaseMessage = err.message.toLowerCase();
        if (lowerCaseMessage.includes('entity was not found')) {
          errorMessage = "Your API Key appears to be invalid. Please check the provided key.";
        } else if (err.message.includes('429') || lowerCaseMessage.includes('quota')) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        }
      }
      setError(errorMessage);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-dark mb-4">1. Leaf Disease Analysis</h2>
      
      <div 
        onClick={triggerFileSelect} 
        className="relative flex-grow flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-green transition-colors text-slate-500 bg-slate-50"
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
                <img src={imagePreview} alt="Leaf preview" className="max-h-full max-w-full w-auto h-auto object-contain rounded-md" />
                {heatmapPreview && (
                    <img 
                        src={heatmapPreview} 
                        alt="Infection heatmap" 
                        className={`absolute top-0 left-0 w-full h-full object-contain rounded-md pointer-events-none transition-opacity duration-300 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`} 
                    />
                )}
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <CameraIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold">Click to upload a photo</p>
            <p className="text-sm">or drag and drop</p>
          </div>
        )}
      </div>

      {imagePreview && heatmapPreview && (
        <div className="mt-4 flex items-center justify-center bg-slate-100 p-2 rounded-lg">
          <label htmlFor="heatmap-toggle" className="flex items-center cursor-pointer">
              <LayersIcon className="h-5 w-5 mr-2 text-slate-600"/>
              <span className="mr-3 text-sm font-medium text-slate-700">Show Infected Areas</span>
              <div className="relative">
                  <input type="checkbox" id="heatmap-toggle" className="sr-only" checked={showHeatmap} onChange={() => setShowHeatmap(!showHeatmap)} />
                  <div className="block bg-slate-300 w-10 h-6 rounded-full"></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHeatmap ? 'translate-x-full bg-brand-green' : ''}`}></div>
              </div>
          </label>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!imageFile || isLoading}
        className="w-full mt-4 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        {isLoading ? (
            <>
                <LoadingSpinner /> 
                <span className="ml-2">{isGeneratingHeatmap ? 'Visualizing...' : 'Analyzing Leaf...'}</span>
            </>
        ): 'Analyze Leaf'}
      </button>

      {error && (
        <div className="mt-4 flex items-start text-red-600 bg-red-50 p-3 rounded-lg">
          <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};