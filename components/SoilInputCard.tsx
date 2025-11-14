

import React, { useState, useEffect } from 'react';
import type { SoilData, AnalysisResult, FertilizerRecommendation, YieldPredictionData } from '../types';
import { CropType } from '../types';
import { getFertilizerRecommendation, getYieldPrediction } from '../services/geminiService';
import { LoadingSpinner, ExclamationIcon } from './IconComponents';

interface SoilInputCardProps {
  setSoilData: (data: SoilData | null) => void;
  analysisResult: AnalysisResult | null;
  setRecommendation: (rec: FertilizerRecommendation | null) => void;
  setPrediction: (pred: YieldPredictionData | null) => void;
  setYieldSources: (sources: any[] | null) => void;
  onSuccess: () => void;
}

export const SoilInputCard: React.FC<SoilInputCardProps> = ({ setSoilData, analysisResult, setRecommendation, setPrediction, setYieldSources, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<SoilData, 'area' | 'crop'> & { area: string; crop: CropType }>({
    crop: CropType.WHEAT,
    n: 15,
    p: 10,
    k: 25,
    s: 10,
    zn: 1.0,
    fe: 4.0,
    ph: 6.5,
    area: '1.0',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const performCalculation = async () => {
    setError(null);
    setIsLoading(true);

    const areaValue = parseFloat(formData.area);
    if (isNaN(areaValue) || areaValue <= 0) {
      setError("Please enter a valid area in hectares.");
      setIsLoading(false);
      return;
    }

    const fullSoilData: SoilData = {
      ...formData,
      n: Number(formData.n),
      p: Number(formData.p),
      k: Number(formData.k),
      ph: Number(formData.ph),
      s: Number(formData.s),
      zn: Number(formData.zn),
      fe: Number(formData.fe),
      area: areaValue
    };
    
    setSoilData(fullSoilData);
    setRecommendation(null);
    setPrediction(null);
    setYieldSources(null);
    
    if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported by your browser. Weather-aware features will be disabled.");
        // Fallback to non-weather aware recommendation if needed, or just stop.
        // For this implementation, we'll stop.
        setIsLoading(false);
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const recommendation = await getFertilizerRecommendation(fullSoilData, analysisResult, latitude, longitude);
              if (analysisResult) {
                  const { prediction, groundingChunks } = await getYieldPrediction(fullSoilData, analysisResult, latitude, longitude);
                  setPrediction(prediction);
                  setYieldSources(groundingChunks || null);
              }
              
              setRecommendation(recommendation);
              onSuccess();
            } catch (err) {
              let errorMessage = err instanceof Error ? err.message : "Failed to get recommendation.";
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
        },
        (geoError) => {
            console.error("Geolocation error:", geoError);
            setError("Could not get location. Please enable location services to use weather-aware features.");
            setIsLoading(false);
        }
    );
  }

  const handleCalculate = async () => {
    await performCalculation();
  };

  // FIX: Added `max` to props to allow setting the max attribute on the input field.
  const InputField = ({ label, name, value, onChange, type = 'number', step = '0.1', unit, min = "0", max }: { label: string, name: keyof typeof formData, value: any, onChange: any, type?: string, step?: string, unit: string, min?: string, max?: string }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={name}
          step={step}
          min={min}
          max={max}
          className="focus:ring-brand-green focus:border-brand-green block w-full pl-3 pr-12 sm:text-sm border-slate-300 rounded-md"
          value={value}
          onChange={onChange}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-500 sm:text-sm">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-brand-dark mb-4">2. Soil & Crop Data</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-slate-700">Crop Type</label>
          <select
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
          >
            {Object.values(CropType).map(crop => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputField label="Nitrogen (N)" name="n" value={formData.n} onChange={handleChange} unit="ppm" />
          <InputField label="Phosphorus (P)" name="p" value={formData.p} onChange={handleChange} unit="ppm" />
          <InputField label="Potassium (K)" name="k" value={formData.k} onChange={handleChange} unit="ppm" />
          <InputField label="Sulphur (S)" name="s" value={formData.s} onChange={handleChange} unit="ppm" />
          <InputField label="Zinc (Zn)" name="zn" value={formData.zn} onChange={handleChange} unit="ppm" step="0.01" />
          <InputField label="Iron (Fe)" name="fe" value={formData.fe} onChange={handleChange} unit="ppm" step="0.01" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Soil pH" name="ph" value={formData.ph} onChange={handleChange} unit="" step="0.1" max="14" />
          <InputField label="Field Area" name="area" value={formData.area} onChange={handleChange} unit="hectares" step="0.1" />
        </div>
        
        <button
          onClick={handleCalculate}
          disabled={isLoading || !analysisResult}
          className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-900 disabled:bg-slate-400 transition-colors flex items-center justify-center"
          title={!analysisResult ? "Please analyze a leaf image first" : "Get Recommendation"}
        >
          {isLoading ? <LoadingSpinner /> : 'Get Recommendation'}
        </button>

        {error && (
          <div className="mt-4 flex items-start text-red-600 bg-red-50 p-3 rounded-lg">
            <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};