import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createChat, handleApiError } from '../services/geminiService';
import { AgroBotIcon, UserIcon, SendIcon, LoadingSpinner, MicrophoneIcon, SpeakerOnIcon, SpeakerOffIcon } from './IconComponents';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData } from '../types';
import { translations, Language } from '../translations';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface AgroBotProps {
  analysisResult: AnalysisResult | null;
  soilData: SoilData | null;
  recommendation: FertilizerRecommendation | null;
  prediction: YieldPredictionData | null;
  activeView: string;
  language: Language;
  translations: (typeof translations)['en-US']['bot'];
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const languageMap: { [key in Language]: string } = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'kn-IN': 'Kannada'
};

export const AgroBot: React.FC<AgroBotProps> = ({ analysisResult, soilData, recommendation, prediction, activeView, language, translations }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice state
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Populate voices when they are loaded
  useEffect(() => {
    const populateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }, []);

  useEffect(() => {
    // Re-initialize chat and reset messages when context or language changes
    try {
        setChat(createChat(analysisResult, soilData, recommendation, prediction, activeView, languageMap[language], translations));
        setMessages([{ sender: 'bot', text: translations.welcome }]);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to initialize chat.";
        setMessages([{ sender: 'bot', text: `Error: ${message}` }]);
    }
  }, [analysisResult, soilData, recommendation, prediction, activeView, language, translations]);

  // Setup Speech Recognition based on the selected language
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language; // Set language for speech recognition

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Automatically send after successful recognition for a more natural voice interface
      handleSend(transcript); 
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = translations.errors.unexpected;
      if (event.error === 'no-speech') {
          errorMessage = translations.errors.noSpeech;
      } else if (event.error === 'network') {
          errorMessage = translations.errors.network;
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMessage = translations.errors.micBlocked;
      }
      setMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [language, chat, translations]); // Rerun when chat changes to capture it in handleSend closure

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput(''); // Clear input before listening
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  // Text-to-speech function with robust voice selection
  const speak = (text: string) => {
      if (isMuted || !window.speechSynthesis) return;

      // Sanitize markdown before speaking for a more natural voice
      const cleanedText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1')   // Italic
        .replace(/#{1,6}\s/g, '')      // Headers
        .replace(/^- /gm, '');         // List items
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = language;
      
      const allVoices = voicesRef.current;
      if (!allVoices.length) {
          console.warn("No speech synthesis voices available.");
          window.speechSynthesis.speak(utterance);
          return;
      }
      
      let selectedVoice: SpeechSynthesisVoice | null = null;
      // 1. Exact match (e.g., 'kn-IN') and local
      selectedVoice = allVoices.find(v => v.lang === language && v.localService) || null;
      // 2. Exact match (any)
      if (!selectedVoice) {
          selectedVoice = allVoices.find(v => v.lang === language) || null;
      }
      // 3. Match language part only (e.g., 'kn') and local
      if (!selectedVoice) {
          const langPart = language.split('-')[0];
          selectedVoice = allVoices.find(v => v.lang.startsWith(langPart) && v.localService) || null;
      }
      // 4. Match language part only (any)
      if (!selectedVoice) {
          const langPart = language.split('-')[0];
          selectedVoice = allVoices.find(v => v.lang.startsWith(langPart)) || null;
      }
      
      if (selectedVoice) {
          utterance.voice = selectedVoice;
      } else {
          console.warn(`No specific voice found for language ${language}. Using browser default.`);
      }
      
      window.speechSynthesis.speak(utterance);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageToSend?: string) => {
    const currentMessage = messageToSend || input;
    if (!currentMessage.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);
    setInput('');
    setIsLoading(true);

    let fullBotResponse = '';
    let isApiKeyError = false;

    // --- Retry Logic ---
    let success = false;
    let attempt = 0;
    const maxRetries = 2; // Total attempts = maxRetries + 1
    let delay = 1000;

    while (attempt <= maxRetries && !success) {
      try {
        const result = await chat.sendMessageStream({ message: currentMessage });
        fullBotResponse = ''; // Reset response for retry attempt
        for await (const chunk of result) {
          const chunkText = chunk.text;
          fullBotResponse += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullBotResponse;
            return newMessages;
          });
        }
        success = true; // Mark as successful to exit loop
      } catch (error) {
        console.error(`Gemini chat error (attempt ${attempt + 1}):`, error);
        const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";

        if (attempt < maxRetries && (errorMessage.includes('429') || errorMessage.includes('quota'))) {
          attempt++;
          const retryMessage = translations.errors.retry(delay/1000, attempt, maxRetries);
          console.warn(retryMessage);

          // Update UI to inform user about retry
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = retryMessage;
            return newMessages;
          });

          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          // Not a retryable error, or max retries reached
          const processedError = handleApiError(error);
          if (processedError.message.toLowerCase().includes('api key')) {
            isApiKeyError = true;
          }
          fullBotResponse = processedError.message;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullBotResponse;
            return newMessages;
          });
          break; // Exit loop
        }
      }
    }
    // --- End Retry Logic ---

    setIsLoading(false);
    // Speak the final response if not muted and no API key error
    if (success && !isApiKeyError && fullBotResponse) {
      speak(fullBotResponse);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-lg flex flex-col">
      <div className="p-4 border-b flex-shrink-0 flex justify-between items-center">
        <h3 className="text-lg font-bold text-brand-dark">{translations.title}</h3>
        <button onClick={() => setIsMuted(!isMuted)} title={isMuted ? translations.unmute : translations.mute} className="p-2 rounded-full hover:bg-slate-200 focus-visible-ring">
          {isMuted ? <SpeakerOffIcon className="h-6 w-6 text-slate-500" /> : <SpeakerOnIcon className="h-6 w-6 text-slate-800" />}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50" aria-live="polite">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <AgroBotIcon className="h-8 w-8 text-brand-green flex-shrink-0" aria-label="Bot" />}
              <div className={`max-w-xs md:max-w-md rounded-2xl p-3 text-sm break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-200 text-brand-dark rounded-bl-none'
              }`}>
                {msg.text || <LoadingSpinner />}
              </div>
              {msg.sender === 'user' && <UserIcon className="h-8 w-8 text-blue-500 flex-shrink-0" aria-label="User" />}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white rounded-b-xl flex-shrink-0">
        <div className="relative flex items-center">
          {SpeechRecognition && (
            <button
              onClick={handleToggleListening}
              aria-label={isListening ? translations.stopListening : translations.startListening}
              className={`p-2 rounded-full transition-colors focus-visible-ring ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-200'}`}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? translations.listening : translations.placeholder}
            aria-label="Chat input"
            className="w-full mx-2 pr-12 pl-4 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-brand-green focus:outline-none focus-visible-ring"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            aria-label={translations.sendAriaLabel}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-white rounded-full p-2.5 transition-colors focus-visible-ring ${
                input.trim() ? 'bg-brand-green hover:bg-green-700' : 'bg-slate-300'
            }`}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};