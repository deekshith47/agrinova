

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AgroBot } from './components/AgroBot';
import type { AnalysisResult, FertilizerRecommendation, SoilData, YieldPredictionData, GroundingChunk } from './types';
import { AgroBotIcon, DashboardIcon, ReportIcon, WeatherIcon, YieldIcon, CommunityIcon, UserCircleIcon, PestIcon, LogoIcon, BeakerIcon, BrainCircuitIcon, DollarIcon, ShoppingCartIcon, FinancialIcon, StorefrontIcon } from './components/IconComponents';
import { RecommendationCard } from './components/RecommendationCard';
import { CommunityHub } from './components/CommunityHub';
import { PestPredictionMap } from './components/PestPredictionMap';
import { WeatherAdvisory } from './components/WeatherAdvisory';
import { YieldPredictor } from './components/YieldPredictor';
import { FinancialDashboard } from './components/FinancialDashboard';
import { NearbyStores } from './components/NearbyStores';

type View = 'dashboard' | 'report' | 'weather' | 'community' | 'bot' | 'pest' | 'yield' | 'economics' | 'profile' | 'financial' | 'stores';
type AppState = 'splash' | 'features' | 'login' | 'main';

// --- Floating Leaves Animation Component ---
const FloatingLeaves = () => {
    const leafProperties = useMemo(() => Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 10}s`,
        width: `${2 + Math.random() * 4}rem`,
        height: `${2 + Math.random() * 4}rem`,
    })), []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {leafProperties.map((style, i) => (
                <div key={i} className="floating-leaf" style={{ left: style.left, animationDuration: style.animationDuration, animationDelay: style.animationDelay, width: style.width, height: style.height }}>
                    <LogoIcon className="w-full h-full" />
                </div>
            ))}
        </div>
    );
};


// --- Landing Splash Screen Component ---
const LandingSplash = () => {
    return (
        <div className={`min-h-screen animated-background flex flex-col items-center justify-center relative overflow-hidden`}>
            <FloatingLeaves />
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
const FeaturesLandingPage = ({ onContinue }: { onContinue: () => void }) => {
    const features = [
        {
            icon: <LogoIcon className="h-8 w-8 text-brand-green" />,
            title: "Leaf Disease Detection",
            description: "Instantly identify crop diseases from a single photo with AI analysis.",
        },
        {
            icon: <BeakerIcon className="h-8 w-8 text-brand-brown" />,
            title: "Personalized Fertilizer Plans",
            description: "Get precise, data-driven nutrient recommendations for your specific soil.",
        },
        {
            icon: <YieldIcon className="h-8 w-8 text-indigo-500" />,
            title: "Yield Forecasting",
            description: "Predict your potential harvest and get advice to maximize production.",
        },
        {
            icon: <PestIcon className="h-8 w-8 text-orange-500" />,
            title: "Weather & Pest Alerts",
            description: "Receive proactive warnings and advice based on local conditions.",
        },
        {
            icon: <BrainCircuitIcon className="h-8 w-8 text-purple-500" />,
            title: "AI-Powered Reasoning",
            description: "Understand the 'why' behind every recommendation with clear explanations.",
        },
        {
            icon: <AgroBotIcon className="h-8 w-8 text-blue-500" />,
            title: "Agro Bot Assistant",
            description: "Chat with an AI expert for instant answers to your farming questions.",
        },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 animated-background relative overflow-hidden">
            <FloatingLeaves />
            <div className="relative z-10 flex flex-col items-center w-full">
                <header className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <LogoIcon className="h-20 w-20 mx-auto text-white [filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.2))]" />
                    <h1 className="text-5xl font-extrabold text-white mt-4 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">Welcome to AgroVision AI</h1>
                    <p className="mt-3 text-lg text-green-100 max-w-2xl mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
                        Your all-in-one AI assistant for smarter, more productive farming.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mt-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                            <div className="flex items-center">
                                {feature.icon}
                                <h3 className="ml-4 text-lg font-bold text-brand-dark">{feature.title}</h3>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <footer className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                    <button
                        onClick={onContinue}
                        className="px-10 py-4 bg-brand-green text-white font-bold text-lg rounded-full shadow-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 animate-pulse-button"
                    >
                        Get Started
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Login Page Component ---
interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen animated-background flex items-center justify-center p-4 relative overflow-hidden">
            <FloatingLeaves />
            <div className="relative z-10 max-w-4xl w-full grid md:grid-cols-2 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm border border-white/20">
                {/* Left Panel - Welcome Message */}
                <div className="bg-green-900/80 text-white p-12 flex-col justify-center items-center rounded-l-2xl animate-slide-in-left hidden md:flex">
                    <LogoIcon className="h-24 w-24 mb-4 text-white" />
                    <h1 className="text-4xl font-bold tracking-tight text-center [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">Welcome Back!</h1>
                    <p className="mt-4 text-center text-green-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
                        Enter your credentials to access your dashboard and start managing your farm with AI.
                    </p>
                </div>
                
                {/* Right Panel - Login Form */}
                <div className="p-12 animate-slide-in-right">
                    <div className="flex justify-center items-center mb-6 md:hidden">
                        <LogoIcon className="h-16 w-16 text-brand-green" />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark mb-2 animate-fade-in text-center md:text-left" style={{ animationDelay: '0.2s' }}>Login</h2>
                    <p className="text-slate-500 mb-8 animate-fade-in text-center md:text-left" style={{ animationDelay: '0.3s' }}>Access your AgroVision AI account.</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-6">
                            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    defaultValue="farmer@agrovision.ai"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
                                />
                            </div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    defaultValue="password"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-10 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green animate-fade-in"
                            style={{ animationDelay: '0.6s' }}
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Economics & Sustainability Page Component ---
const EconomicsSustainabilityPage = ({ recommendation }: { recommendation: FertilizerRecommendation | null }) => {
    if (!recommendation) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center">
                <div className="text-center max-w-lg">
                    <DollarIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-brand-dark">Economics & Sustainability Analysis</h3>
                    <p className="text-slate-500 mt-2">
                        Complete a full analysis on the Dashboard to unlock cost estimates, sustainability scores, and smart purchase suggestions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Economics & Sustainability</h2>
            <p className="text-sm text-slate-600 -mt-2 mb-6">Estimates costs, provides eco-friendly advice, and suggests purchase options.</p>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-slate-700">Cost Estimation</h4>
                        <div className="mt-2 bg-green-50 p-4 rounded-lg min-w-0 h-full">
                            <p className="text-sm font-medium text-green-800">Estimated Total Fertilizer Cost</p>
                            <p className="text-3xl font-bold text-green-900">₹{recommendation.totalCost.toFixed(2)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700">Eco-friendly Advisory</h4>
                        <div className="mt-2 bg-teal-50 p-4 rounded-lg min-w-0 h-full">
                            <p className="text-sm font-medium text-teal-800">Sustainability Score</p>
                            <p className="text-3xl font-bold text-teal-900">{recommendation.sustainabilityScore.score}/100</p>
                            <p className="text-sm text-teal-700 mt-2 whitespace-pre-wrap break-all">{recommendation.sustainabilityScore.feedback}</p>
                        </div>
                    </div>
                </div>
                {recommendation.smartPurchaseLinks && (
                    <div>
                        <h4 className="font-semibold text-slate-700">Smart Purchase Suggestions</h4>
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
const ProfilePage = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
            <div className="text-center">
                <UserCircleIcon className="h-24 w-24 mx-auto text-slate-300 mb-4" />
                <h2 className="text-3xl font-bold text-brand-dark">Aditya Sharma</h2>
                <p className="text-slate-500">Farmer Profile</p>
                <div className="mt-6 text-lg font-semibold text-brand-green bg-green-50 px-4 py-2 rounded-full inline-block">
                    <p>Productivity tracking & cost trends</p>
                    <p className="text-sm font-normal text-slate-500">Coming Soon!</p>
                </div>
            </div>
        </div>
    );
};


interface NavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
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

const Sidebar: React.FC<NavProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-brand-dark text-white flex-shrink-0 flex-col p-4 no-print hidden md:flex">
      <div className="flex items-center mb-10 px-2 pt-2">
        <LogoIcon className="h-10 w-10 text-brand-green" />
        <h1 className="ml-3 text-2xl font-bold">AgroVision AI</h1>
      </div>

      <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto">
        <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis</h3>
        <NavItem
          icon={<DashboardIcon className="h-6 w-6" />}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<ReportIcon className="h-6 w-6" />}
          label="Agro Report"
          isActive={activeView === 'report'}
          onClick={() => setActiveView('report')}
        />

        <h3 className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tools & Features</h3>
        <NavItem
          icon={<PestIcon className="h-6 w-6" />}
          label="Pest Prediction Map"
          isActive={activeView === 'pest'}
          onClick={() => setActiveView('pest')}
        />
        <NavItem
          icon={<WeatherIcon className="h-6 w-6" />}
          label="Weather Advisory"
          isActive={activeView === 'weather'}
          onClick={() => setActiveView('weather')}
        />
        <NavItem
          icon={<YieldIcon className="h-6 w-6" />}
          label="Yield Predictor"
          isActive={activeView === 'yield'}
          onClick={() => setActiveView('yield')}
        />
        <NavItem
          icon={<DollarIcon className="h-6 w-6" />}
          label="Economics"
          isActive={activeView === 'economics'}
          onClick={() => setActiveView('economics')}
        />
        <NavItem
          icon={<FinancialIcon className="h-6 w-6" />}
          label="Market Prices"
          isActive={activeView === 'financial'}
          onClick={() => setActiveView('financial')}
        />
         <NavItem
          icon={<StorefrontIcon className="h-6 w-6" />}
          label="Nearby Stores"
          isActive={activeView === 'stores'}
          onClick={() => setActiveView('stores')}
        />
        <NavItem
          icon={<CommunityIcon className="h-6 w-6" />}
          label="Community Hub"
          isActive={activeView === 'community'}
          onClick={() => setActiveView('community')}
        />
        <NavItem
          icon={<AgroBotIcon className="h-6 w-6" />}
          label="Agro Bot"
          isActive={activeView === 'bot'}
          onClick={() => setActiveView('bot')}
        />
      </nav>
      
      <div className="mt-auto border-t border-slate-700 pt-4">
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex items-center w-full p-2 text-left rounded-lg transition-colors ${activeView === 'profile' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
          >
              <UserCircleIcon className="h-10 w-10 text-slate-300" />
              <div className="ml-3">
                  <p className="font-semibold text-white">Aditya Sharma</p>
                  <p className="text-sm text-slate-400">Farmer Profile</p>
              </div>
          </button>
      </div>
    </aside>
  );
};

const BottomNavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-shrink-0 w-20 pt-2 pb-1 transition-colors duration-200 ${
            isActive ? 'text-brand-green' : 'text-slate-500 hover:bg-slate-100'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="mt-1 font-medium text-[10px] leading-tight text-center">{label}</span>
    </button>
);

const BottomNavBar: React.FC<NavProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { view: 'dashboard', label: 'Home', icon: <DashboardIcon className="h-5 w-5" /> },
        { view: 'report', label: 'Report', icon: <ReportIcon className="h-5 w-5" /> },
        { view: 'pest', label: 'Pests', icon: <PestIcon className="h-5 w-5" /> },
        { view: 'weather', label: 'Weather', icon: <WeatherIcon className="h-5 w-5" /> },
        { view: 'yield', label: 'Yield', icon: <YieldIcon className="h-5 w-5" /> },
        { view: 'economics', label: 'Econ', icon: <DollarIcon className="h-5 w-5" /> },
        { view: 'financial', label: 'Market', icon: <FinancialIcon className="h-5 w-5" /> },
        { view: 'stores', label: 'Stores', icon: <StorefrontIcon className="h-5 w-5" /> },
        { view: 'community', label: 'Community', icon: <CommunityIcon className="h-5 w-5" /> },
        { view: 'bot', label: 'Bot', icon: <AgroBotIcon className="h-5 w-5" /> },
        { view: 'profile', label: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
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

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('features');
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [appState]);

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
          />
        );
      case 'economics':
        return <EconomicsSustainabilityPage recommendation={recommendation} />;
      case 'financial':
        return <FinancialDashboard />;
      case 'stores':
        return <NearbyStores recommendation={recommendation} />;
      case 'profile':
        return <ProfilePage />;
      case 'bot':
        return <AgroBot 
            analysisResult={analysisResult}
            soilData={soilData}
            recommendation={recommendation}
            prediction={prediction}
            activeView={activeView}
        />;
      case 'pest':
        return <PestPredictionMap soilData={soilData} />;
      case 'weather':
        return <WeatherAdvisory soilData={soilData} />;
      case 'community':
        return <CommunityHub />;
      case 'yield':
        return <YieldPredictor analysisResult={analysisResult} soilData={soilData} prediction={prediction} setPrediction={setPrediction} yieldSources={yieldSources} />;
      default:
        return null;
    }
  };
  
  switch(appState) {
    case 'splash':
      return <LandingSplash />;
    case 'features':
      return <FeaturesLandingPage onContinue={() => setAppState('login')} />;
    case 'login':
      return <LoginPage onLogin={() => setAppState('main')} />;
    case 'main':
      return (
        <div className="flex h-screen bg-brand-light-gray text-brand-dark">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header activeView={activeView} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 pb-20 md:pb-8">
              {renderAppContent()}
            </main>
          </div>
          <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
        </div>
      );
    default:
      return null;
  }
};

export default App;