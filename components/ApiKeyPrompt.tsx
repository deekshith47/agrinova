import React from 'react';
import { LogoIcon, InfoIcon } from './IconComponents';

interface ApiKeyPromptProps {
  onSelectKey: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSelectKey }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-brand-light-gray">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="flex justify-center items-center mb-6">
          <LogoIcon className="h-12 w-12 text-brand-green" />
          <h1 className="ml-3 text-3xl font-bold text-brand-dark">AgroVision AI</h1>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome!</h2>
        <p className="text-slate-600 mb-6">
          To power the advanced AI features of this application, please select your Google AI API key.
        </p>

        <button
          onClick={onSelectKey}
          className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-lg"
        >
          Select API Key
        </button>
        
        <div className="mt-6 flex items-start text-left text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
          <InfoIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            Your API key is securely handled and used only for processing your requests. For information on usage and billing, please refer to the 
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-green font-medium hover:underline ml-1"
            >
              billing documentation
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
};