
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AgroBot } from './components/AgroBot';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData, GroundingChunk } from './types';
import {
    LogoIcon,
    BrainCircuitIcon,
    BeakerIcon,
    YieldIcon,
    PestIcon,
    CommunityIcon,
    AgroBotIcon,
    DollarIcon,
    ShoppingCartIcon,
    UserCircleIcon,
    DashboardIcon,
    ReportIcon,
    WeatherIcon,
    FinancialIcon,
    StorefrontIcon
} from './components/IconComponents';
import { RecommendationCard } from './components/RecommendationCard';
import { CommunityHub } from './components/CommunityHub';
import { PestPredictionMap } from './components/PestPredictionMap';
import { WeatherAdvisory } from './components/WeatherAdvisory';
import { YieldPredictor } from './components/YieldPredictor';
import { FinancialDashboard } from './components/FinancialDashboard';
import { NearbyStores } from './components/NearbyStores';
import { Language, translations } from './translations';

// --- Start Re-exported components from App.tsx as they are defined here ---
// These components were moved here to keep App.tsx as the main orchestrator and to resolve dependency cycles.

type View = 'dashboard' | 'report' | 'weather' | 'community' | 'bot' | 'pest' | 'yield' | 'economics' | 'profile' | 'financial' | 'stores';
type AppState = 'splash' | 'features' | 'login' | 'main';

// --- 3D Floating Shapes Animation Component ---
const FloatingShapes3D = () => {
    const shapes = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        style: {
            '--left': `${Math.random() * 100}%`,
            '--size': `${2 + Math.random() * 6}rem`,
            '--z-depth': `${-500 + Math.random() * 1000}px`,
            '--duration': `${20 + Math.random() * 20}s`,
            '--delay': `${Math.random() * 20}s`,
            '--start-opacity': `${0.1 + Math.random() * 0.4}`,
        } as React.CSSProperties,
    })), []);

    return (
        <>
            {shapes.map(({ id, style }) => (
                <div key={id} className="floating-shape" style={style}>
                    <LogoIcon className="w-full h-full" />
                </div>
            ))}
        </>
    );
};


// --- Landing Splash Screen Component ---
const LandingSplash = () => {
    return (
        <div className={`min-h-screen animated-background flex flex-col items-center justify-center relative overflow-hidden`}>
            <div className="perspective-container" aria-hidden="true">
                <FloatingShapes3D />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="animate-pulse-and-fade-in">
                    <LogoIcon className="h-32 w-32 text-white [filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.3))]" />
                </div>
                <h1 className="text-5xl font-bold text-white mt-6 animate-fade-in-text [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                    AgroVision AI
                </h1>
            </div>
        </div>
    );
};

// --- Features Landing Page Component ---
const FeaturesPage = ({ onContinue, t }: { onContinue: () => void, t: (typeof translations)['en-US']['features'] }) => {
    
    const features = [
        { icon: <BrainCircuitIcon className="h-8 w-8 text-brand-green"/>, title: t.aiDetection.title, description: t.aiDetection.description },
        { icon: <BeakerIcon className="h-8 w-8 text-brand-brown"/>, title: t.fertilizer.title, description: t.fertilizer.description },
        { icon: <YieldIcon className="h-8 w-8 text-indigo-500"/>, title: t.yield.title, description: t.yield.description },
        { icon: <PestIcon className="h-8 w-8 text-orange-500"/>, title: t.alerts.title, description: t.alerts.description },
        { icon: <CommunityIcon className="h-8 w-8 text-blue-500"/>, title: t.hub.title, description: t.hub.description },
        { icon: <AgroBotIcon className="h-8 w-8 text-slate-500"/>, title: t.bot.title, description: t.bot.description },
    ];

    return (
        <div className="min-h-screen animated-background flex flex-col items-center justify-center p-6 relative">
            <div className="perspective-container" aria-hidden="true">
                <FloatingShapes3D />
            </div>
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold animate-fade-in-up [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.1s' }}>
                    {t.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl opacity-90 animate-fade-in-up [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.3s' }}>
                    {t.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {features.map((feature, index) => (
                        <div key={feature.title} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-left animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                            <div className="flex items-center justify-center h-16 w-16 bg-white/20 rounded-xl mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="mt-2 text-white/80">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onContinue}
                    className="mt-12 px-10 py-4 text-lg font-bold text-white bg-brand-green rounded-full shadow-lg transition-transform hover:scale-105 animate-pulse-button focus-visible-ring"
                >
                    {t.continueButton}
                </button>
            </div>
        </div>
    );
};

// --- Login Page Component ---
const LoginPage = ({ onLogin, t }: { onLogin: () => void, t: (typeof translations)['en-US']['login'] }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-gray">
            <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden">
                {/* Left Panel */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-white animated-background animate-slide-in-left relative">
                    <div className="perspective-container" aria-hidden="true">
                        <FloatingShapes3D />
                    </div>
                    <div className="relative z-10 text-center">
                        <LogoIcon className="h-20 w-20 mx-auto" />
                        <h1 className="text-4xl font-bold mt-4">{t.welcome}</h1>
                        <p className="mt-2 opacity-90">{t.subtitle}</p>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full md:w-1/2 p-10 bg-white animate-slide-in-right">
                    <h2 className="text-3xl font-bold text-brand-dark mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>{t.signInTitle}</h2>
                    <p className="text-slate-500 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>{t.signInSubtitle}</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-6">
                            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">{t.emailLabel}</label>
                                <input className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition focus-visible-ring" type="email" id="email" defaultValue="farmer@agromail.com" />
                            </div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">{t.passwordLabel}</label>
                                <input className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition focus-visible-ring" type="password" id="password" defaultValue="••••••••" />
                            </div>
                        </div>
                        <button className="w-full mt-8 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-lg flex items-center justify-center disabled:bg-slate-400 animate-fade-in focus-visible-ring" style={{ animationDelay: '0.6s' }}>
                            {t.signInButton}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Economics & Sustainability Page Component ---
const EconomicsSustainabilityPage = ({ recommendation, t }: { recommendation: FertilizerRecommendation | null, t: (typeof translations)['en-US']['economics'] }) => {
    if (!recommendation) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center">
                <div className="text-center max-w-lg">
                    <DollarIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-brand-dark">{t.title}</h3>
                    <p className="text-slate-500 mt-2">
                        {t.unlockMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
            <p className="text-sm text-slate-600 -mt-2 mb-6">{t.subtitle}</p>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-slate-700">{t.costEstimation.title}</h4>
                        <div className="mt-2 bg-green-50 p-4 rounded-lg min-w-0 h-full">
                            <p className="text-sm font-medium text-green-800">{t.costEstimation.label}</p>
                            <p className="text-3xl font-bold text-green-900">₹{recommendation.totalCost.toFixed(2)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700">{t.sustainability.title}</h4>
                        <div className="mt-2 bg-teal-50 p-4 rounded-lg min-w-0 h-full">
                            <p className="text-sm font-medium text-teal-800">{t.sustainability.scoreLabel}</p>
                            <p className="text-3xl font-bold text-teal-900">{recommendation.sustainabilityScore.score}/100</p>
                            <p className="text-sm text-teal-700 mt-2 whitespace-pre-wrap break-all">{recommendation.sustainabilityScore.feedback}</p>
                        </div>
                    </div>
                </div>
                {recommendation.smartPurchaseLinks && (
                    <div>
                        <h4 className="font-semibold text-slate-700">{t.purchase.title}</h4>
                            <ul className="text-sm text-slate-600 mt-2 space-y-2">
                            {recommendation.smartPurchaseLinks.split('\n').filter(link => link.trim()).map((link, index) => (
                                <li key={index} className="flex items-start p-2 bg-slate-50 rounded-md">
                                    <ShoppingCartIcon className="h-5 w-5 text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="break-all">{link.replace(/^- /, '')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Farmer Profile Page Component ---
const ProfilePage = ({ t }: { t: (typeof translations)['en-US']['profile'] }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
            <div className="text-center">
                <UserCircleIcon className="h-24 w-24 mx-auto text-slate-300 mb-4" />
                <h2 className="text-3xl font-bold text-brand-dark">Aditya Sharma</h2>
                <p className="text-slate-500">{t.title}</p>
                <div className="mt-6 text-lg font-semibold text-brand-green bg-green-50 px-4 py-2 rounded-full inline-block">
                    <p>{t.comingSoon.title}</p>
                    <p className="text-sm font-normal text-slate-500">{t.comingSoon.subtitle}</p>
                </div>
            </div>
        </div>
    );
};


interface NavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  t: (typeof translations)['en-US']['nav'];
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg focus-visible-ring ${
      isActive
        ? 'bg-brand-green text-white'
        : 'text-slate-200 hover:bg-slate-700'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <div className="mr-3">{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<NavProps> = ({ activeView, setActiveView, t }) => {
  return (
    <aside className="w-64 bg-brand-dark text-white flex-shrink-0 flex-col p-4 no-print hidden md:flex">
      <div className="flex items-center mb-10 px-2 pt-2">
        <LogoIcon className="h-10 w-10 text-brand-green" />
        <h1 className="ml-3 text-2xl font-bold">AgroVision AI</h1>
      </div>

      <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto">
        <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.analysis}</h3>
        <NavItem
          icon={<DashboardIcon className="h-6 w-6" />}
          label={t.dashboard}
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<ReportIcon className="h-6 w-6" />}
          label={t.report}
          isActive={activeView === 'report'}
          onClick={() => setActiveView('report')}
        />

        <h3 className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.tools}</h3>
        <NavItem
          icon={<PestIcon className="h-6 w-6" />}
          label={t.pest}
          isActive={activeView === 'pest'}
          onClick={() => setActiveView('pest')}
        />
        <NavItem
          icon={<WeatherIcon className="h-6 w-6" />}
          label={t.weather}
          isActive={activeView === 'weather'}
          onClick={() => setActiveView('weather')}
        />
        <NavItem
          icon={<YieldIcon className="h-6 w-6" />}
          label={t.yield}
          isActive={activeView === 'yield'}
          onClick={() => setActiveView('yield')}
        />
        <NavItem
          icon={<DollarIcon className="h-6 w-6" />}
          label={t.economics}
          isActive={activeView === 'economics'}
          onClick={() => setActiveView('economics')}
        />
        <NavItem
          icon={<FinancialIcon className="h-6 w-6" />}
          label={t.market}
          isActive={activeView === 'financial'}
          onClick={() => setActiveView('financial')}
        />
         <NavItem
          icon={<StorefrontIcon className="h-6 w-6" />}
          label={t.stores}
          isActive={activeView === 'stores'}
          onClick={() => setActiveView('stores')}
        />
        <NavItem
          icon={<CommunityIcon className="h-6 w-6" />}
          label={t.community}
          isActive={activeView === 'community'}
          onClick={() => setActiveView('community')}
        />
        <NavItem
          icon={<AgroBotIcon className="h-6 w-6" />}
          label={t.bot}
          isActive={activeView === 'bot'}
          onClick={() => setActiveView('bot')}
        />
      </nav>
      
      <div className="mt-auto border-t border-slate-700 pt-4">
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex items-center w-full p-2 text-left rounded-lg transition-colors focus-visible-ring ${activeView === 'profile' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
          >
              <UserCircleIcon className="h-10 w-10 text-slate-300" />
              <div className="ml-3">
                  <p className="font-semibold text-white">Aditya Sharma</p>
                  <p className="text-sm text-slate-400">{t.profile}</p>
              </div>
          </button>
      </div>
    </aside>
  );
};

const BottomNavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-shrink-0 w-20 pt-2 pb-1 transition-colors duration-200 focus-visible-ring ${
            isActive ? 'text-brand-green' : 'text-slate-500 hover:bg-slate-100'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="mt-1 font-medium text-[10px] leading-tight text-center">{label}</span>
    </button>
);

const BottomNavBar: React.FC<NavProps> = ({ activeView, setActiveView, t }) => {
    const navItems = [
        { view: 'dashboard', label: t.dashboard, icon: <DashboardIcon className="h-5 w-5" /> },
        { view: 'report', label: t.report, icon: <ReportIcon className="h-5 w-5" /> },
        { view: 'pest', label: t.pest, icon: <PestIcon className="h-5 w-5" /> },
        { view: 'weather', label: t.weather, icon: <WeatherIcon className="h-5 w-5" /> },
        { view: 'yield', label: t.yield, icon: <YieldIcon className="h-5 w-5" /> },
        { view: 'economics', label: t.econ, icon: <DollarIcon className="h-5 w-5" /> },
        { view: 'financial', label: t.market, icon: <FinancialIcon className="h-5 w-5" /> },
        { view: 'stores', label: t.stores, icon: <StorefrontIcon className="h-5 w-5" /> },
        { view: 'community', label: t.community, icon: <CommunityIcon className="h-5 w-5" /> },
        { view: 'bot', label: t.bot, icon: <AgroBotIcon className="h-5 w-5" /> },
        { view: 'profile', label: t.profile, icon: <UserCircleIcon className="h-5 w-5" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-t-lg flex md:hidden no-print z-50 overflow-x-auto">
            {navItems.map(item => (
                <BottomNavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeView === item.view}
                    onClick={() => setActiveView(item.view as View)}
                />
            ))}
        </nav>
    );
};

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>(null);
  const [prediction, setPrediction] = useState<YieldPredictionData | null>(null);
  const [yieldSources, setYieldSources] = useState<GroundingChunk[] | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [appState, setAppState] = useState<AppState>('splash');
  const [language, setLanguage] = useState<Language>('en-US');
  const [contentKey, setContentKey] = useState(0); // Used to re-trigger animation

  const t = useMemo(() => translations[language], [language]);

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('features');
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    // This effect adds a simple fade-in animation when the view changes
    setContentKey(prevKey => prevKey + 1);
  }, [activeView]);


  const renderAppContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            setAnalysisResult={setAnalysisResult}
            setSoilData={setSoilData}
            analysisResult={analysisResult}
            setRecommendation={setRecommendation}
            setPrediction={setPrediction}
            setYieldSources={setYieldSources}
            onAnalysisComplete={() => setActiveView('report')}
            t={t.dashboard}
          />
        );
      case 'report':
        return (
          <RecommendationCard
              recommendation={recommendation}
              analysisResult={analysisResult}
              soilData={soilData}
              prediction={prediction}
              yieldSources={yieldSources}
              onReset={() => {
                  setAnalysisResult(null);
                  setSoilData(null);
                  setRecommendation(null);
                  setPrediction(null);
                  setYieldSources(null);
                  setActiveView('dashboard');
              }}
              t={t.report}
          />
        );
      case 'economics':
        return <EconomicsSustainabilityPage recommendation={recommendation} t={t.economics} />;
      case 'financial':
        return <FinancialDashboard t={t.financial} />;
      case 'stores':
        return <NearbyStores recommendation={recommendation} t={t.stores} />;
      case 'profile':
        return <ProfilePage t={t.profile} />;
      case 'bot':
        return <AgroBot 
            analysisResult={analysisResult}
            soilData={soilData}
            recommendation={recommendation}
            prediction={prediction}
            activeView={activeView}
            language={language}
            translations={t.bot}
        />;
      case 'pest':
        return <PestPredictionMap soilData={soilData} t={t.pest} />;
      case 'weather':
        return <WeatherAdvisory soilData={soilData} t={t.weather} />;
      case 'community':
        return <CommunityHub t={t.community} />;
      case 'yield':
        return <YieldPredictor analysisResult={analysisResult} soilData={soilData} prediction={prediction} setPrediction={setPrediction} yieldSources={yieldSources} t={t.yield} />;
      default:
        return null;
    }
  };
  
  switch(appState) {
    case 'splash':
      return <LandingSplash />;
    case 'features':
      return <FeaturesPage onContinue={() => setAppState('login')} t={t.features} />;
    case 'login':
      return <LoginPage onLogin={() => setAppState('main')} t={t.login} />;
    case 'main':
      return (
        <div className="flex h-screen bg-brand-light-gray text-brand-dark">
          <Sidebar activeView={activeView} setActiveView={setActiveView} t={t.nav} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header activeView={activeView} t={t.nav} language={language} setLanguage={setLanguage} />
            <main key={contentKey} className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 pb-20 md:pb-8 animate-fade-in">
              {renderAppContent()}
            </main>
          </div>
          <BottomNavBar activeView={activeView} setActiveView={setActiveView} t={t.nav} />
        </div>
      );
    default:
      return null;
  }
};

export default App;
