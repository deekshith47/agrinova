

import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import { AgroBotIcon, UserIcon, SendIcon, LoadingSpinner, MicrophoneIcon, SpeakerOnIcon, SpeakerOffIcon } from './IconComponents';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData } from '../types';

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
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const translations = {
    'en-US': {
        welcome: "Hello! I'm Agro Bot. Feel free to ask me general farming questions. For advice specific to your farm, please complete an analysis first.",
        placeholder: "Ask a question...",
        listening: "Listening...",
        mute: "Mute",
        unmute: "Unmute"
    },
    'hi-IN': {
        welcome: "नमस्ते! मैं एग्रो बॉट हूँ। आप मुझसे खेती से जुड़े सामान्य प्रश्न पूछ सकते हैं। अपने खेत के लिए विशेष सलाह पाने के लिए, कृपया पहले एक विश्लेषण पूरा करें।",
        placeholder: "एक सवाल पूछें...",
        listening: "सुन रहा हूँ...",
        mute: "म्यूट",
        unmute: "अनम्यूट"
    },
    'kn-IN': {
        welcome: "ನಮಸ್ಕಾರ! ನಾನು ಆಗ್ರೋ ಬೋಟ್. ಸಾಮಾನ್ಯ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ಹಿಂಜರಿಯಬೇಡಿ. ನಿಮ್ಮ ಜಮೀನಿಗೆ ನಿರ್ದಿಷ್ಟ ಸಲಹೆಗಾಗಿ, ದಯವಿಟ್ಟು ಮೊದಲು ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
        placeholder: "ಪ್ರಶ್ನೆ ಕೇಳಿ...",
        listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
        mute: "ಮ್ಯೂಟ್",
        unmute: "ಅನ್‌ಮ್ಯೂಟ್"
    }
};

const languageOptions = {
    'en-US': 'English',
    'hi-IN': 'हिन्दी',
    'kn-IN': 'ಕನ್ನಡ'
};

const languageMap: { [key: string]: string } = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'kn-IN': 'Kannada'
};

export const AgroBot: React.FC<AgroBotProps> = ({ analysisResult, soilData, recommendation, prediction, activeView }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice and Language state
  const [language, setLanguage] = useState<keyof typeof translations>('en-US');
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
    setChat(createChat(analysisResult, soilData, recommendation, prediction, activeView, languageMap[language]));
    setMessages([{ sender: 'bot', text: translations[language].welcome }]);
  }, [analysisResult, soilData, recommendation, prediction, activeView, language]);

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
      // Automatically send after successful recognition
      // This feels more natural for a voice interface
      // handleSend(transcript); 
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [language]);

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput(''); // Clear input before listening
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  // Text-to-speech function that uses the selected language
  const speak = (text: string) => {
      if (isMuted || !window.speechSynthesis) return;
      
      window.speechSynthesis.cancel(); // Stop any currently speaking utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language; // Set language for speech synthesis
      
      // Find a matching voice for better quality if available
      const voice = voicesRef.current.find(v => v.lang === language);
      if (voice) {
          utterance.voice = voice;
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
    try {
      const result = await chat.sendMessageStream({ message: currentMessage });
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullBotResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullBotResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Gemini chat error:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error instanceof Error) {
          const lowerCaseMessage = error.message.toLowerCase();
          if (lowerCaseMessage.includes('entity was not found')) {
              errorMessage = "Your API Key appears to be invalid. Please check the provided key.";
              isApiKeyError = true;
          } else if (error.message.includes('429') || lowerCaseMessage.includes('quota')) {
              errorMessage = "Too many requests. I need to rest for a moment. Please try again shortly.";
              isApiKeyError = true; // Prevents the bot from trying to speak the error message
          }
      }
      fullBotResponse = errorMessage;
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = fullBotResponse;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      // Speak the final response if not muted and no API key error
      if (!isApiKeyError && fullBotResponse) {
        speak(fullBotResponse);
      }
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const LanguageSelector = () => (
    <div className="flex items-center space-x-2">
      {Object.entries(languageOptions).map(([code, name]) => (
        <button
          key={code}
          onClick={() => setLanguage(code as keyof typeof translations)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            language === code ? 'bg-brand-green text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-white rounded-xl shadow-lg flex flex-col">
      <div className="p-4 border-b flex-shrink-0 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-bold text-brand-dark">Agro Bot Assistant</h3>
            <div className="mt-2">
                <LanguageSelector />
            </div>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} title={isMuted ? translations[language].unmute : translations[language].mute}>
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
                  ? 'bg-blue-500 text-white rounded-br-none'
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
              aria-label={isListening ? "Stop listening" : "Start listening"}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-200'}`}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? translations[language].listening : translations[language].placeholder}
            aria-label="Chat input"
            className="w-full mx-2 pr-12 pl-4 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-brand-green focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-white rounded-full p-2.5 transition-colors ${
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