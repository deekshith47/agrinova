import React from 'react';
import { Language, translations } from '../translations';

interface HeaderProps {
    activeView: 'dashboard' | 'report' | 'weather' | 'community' | 'bot' | 'pest' | 'yield' | 'economics' | 'profile' | 'financial' | 'stores';
    t: (typeof translations)['en-US']['nav'];
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageSelector: React.FC<{ language: Language, setLanguage: (lang: Language) => void }> = ({ language, setLanguage }) => {
    const languageOptions = {
        'en-US': 'English',
        'hi-IN': 'हिन्दी',
        'kn-IN': 'ಕನ್ನಡ'
    };
    return (
        <div className="relative">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-slate-100 border border-slate-300 text-slate-700 text-sm font-semibold rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent focus-visible-ring"
                aria-label="Select language"
            >
                {Object.entries(languageOptions).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.924 9.163c0-.418.032-1.17.592-1.615z"/></svg>
            </div>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ activeView, t, language, setLanguage }) => {
  const titleMap = {
    dashboard: t.dashboard,
    report: t.report,
    bot: t.bot,
    weather: t.weather,
    community: t.community,
    pest: t.pest,
    yield: t.yield,
    economics: t.economics,
    financial: t.market,
    stores: t.stores,
    profile: t.profile,
  };
  const title = titleMap[activeView] || t.dashboard;
  
  return (
    <header className="bg-white shadow-sm flex-shrink-0 no-print">
      <div className="px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold text-slate-800">
            {title}
          </h1>
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
      </div>
    </header>
  );
};