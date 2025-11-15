import React, { useState, useRef } from 'react';
import { CameraIcon, LoadingSpinner, InfoIcon, ExclamationIcon, CommunityIcon } from './IconComponents';
import { getCommunityHubContributionResponse, handleApiError } from '../services/geminiService';
import type { CommunityContributor } from '../types';
import { translations } from '../translations';

interface CommunityHubProps {
  t: (typeof translations)['en-US']['community'];
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

const commonDiseases = [
    "Select a diagnosis...",
    "Healthy",
    "Septoria leaf spot",
    "Powdery mildew",
    "Downy mildew",
    "Rust",
    "Blight (Early or Late)",
    "Mosaic Virus",
    "Iron Deficiency",
    "Zinc Deficiency",
    "Sulphur Deficiency",
    "Other"
];

const leaderboardData: CommunityContributor[] = [
    { id: 1, name: "Ramesh Kumar", contributions: 128, credits: 2560 },
    { id: 2, name: "Priya Singh", contributions: 94, credits: 1880 },
    { id: 3, name: "Anjali Gupta", contributions: 72, credits: 1440 },
    { id: 4, name: "Sanjay Patel", contributions: 56, credits: 1120 },
];


export const CommunityHub: React.FC<CommunityHubProps> = ({ t }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [label, setLabel] = useState(t.labelPlaceholder);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetForm = () => {
      setImagePreview(null);
      setImageFile(null);
      setLabel(t.labelPlaceholder);
      setError(null);
      setSuccessMessage(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
      setSuccessMessage(null);
    }
  };
  
  const performContribute = async () => {
    if (!imageFile || label === t.labelPlaceholder) {
      setError(t.error);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
        const base64Image = await blobToBase64(imageFile);
        const responseText = await getCommunityHubContributionResponse(base64Image, imageFile.type, label);
        setSuccessMessage(responseText);
    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleContribute = async () => {
    await performContribute();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Contribution Card */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
        <p className="text-slate-600 mb-4 text-sm">{t.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          {/* Image Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()} 
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={t.upload.ariaLabel}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-green transition-colors text-slate-500 p-4 focus-visible-ring"
          >
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {imagePreview ? (
              <img src={imagePreview} alt="Leaf preview" className="max-h-48 w-full object-contain rounded-md" />
            ) : (
              <div className="text-center">
                <CameraIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold">{t.upload.prompt}</p>
                <p className="text-sm">{t.upload.subprompt}</p>
              </div>
            )}
          </div>

          {/* Labeling */}
          <div className="flex flex-col">
            <label htmlFor="diagnosis-label" className="block text-sm font-medium text-slate-700 mb-2">{t.label}</label>
            <select
              id="diagnosis-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md focus-visible-ring"
              disabled={!imageFile}
            >
              {[t.labelPlaceholder, ...commonDiseases.slice(1)].map(d => <option key={d} value={d} disabled={d === t.labelPlaceholder}>{d}</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-2">{t.labelHelp}</p>
             
             <div className="mt-auto">
                <button
                    onClick={handleContribute}
                    disabled={!imageFile || label === t.labelPlaceholder || isLoading}
                    className="w-full mt-4 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center focus-visible-ring"
                >
                    {isLoading ? <LoadingSpinner /> : t.contributeButton}
                </button>
             </div>
          </div>
        </div>
        
        {error && (
            <div className="mt-4 flex items-start text-red-600 bg-red-50 p-3 rounded-lg" role="alert">
                <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}
        {successMessage && (
            <div className="mt-4 flex items-start text-green-700 bg-green-50 p-4 rounded-lg" role="alert">
                <InfoIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                    <p className="text-sm font-bold">{t.success.title}</p>
                    <p className="text-sm">{successMessage}</p>
                    <button onClick={resetForm} className="text-sm font-bold text-green-800 hover:underline mt-2 focus-visible-ring rounded-sm">{t.success.contributeAnother}</button>
                </div>
            </div>
        )}
      </div>

      {/* Leaderboard Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
            <CommunityIcon className="h-6 w-6 text-brand-green" />
            <h3 className="ml-3 text-xl font-bold text-brand-dark">{t.leaderboard.title}</h3>
        </div>
        <ul className="space-y-3">
          {leaderboardData.map((user, index) => (
            <li key={user.id} className="flex items-center bg-slate-50 p-3 rounded-lg">
              <span className="font-bold text-slate-500 w-6 text-lg">{index + 1}</span>
              <div className="flex-grow ml-3">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.contributions} {t.leaderboard.contributions}</p>
              </div>
              <div className="text-right">
                 <p className="font-bold text-brand-green">{user.credits}</p>
                 <p className="text-xs text-slate-500">{t.leaderboard.credits}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
