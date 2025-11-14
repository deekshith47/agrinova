
import React from 'react';

interface HeaderProps {
    activeView: 'dashboard' | 'report' | 'weather' | 'community' | 'bot' | 'pest' | 'yield' | 'economics' | 'profile' | 'financial' | 'stores';
}

export const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const titleMap = {
    dashboard: "Dashboard",
    report: "Agro-Report",
    bot: "Agro Bot Assistant",
    weather: "Weather Advisory",
    community: "Community Hub",
    pest: "Pest Prediction Map",
    yield: "Yield Predictor",
    economics: "Economics & Sustainability",
    financial: "Financial & Market Prices",
    stores: "Nearby Stores & Reviews",
    profile: "Farmer Profile",
  };
  const title = titleMap[activeView] || "Dashboard";
  
  return (
    <header className="bg-white shadow-sm flex-shrink-0 no-print">
      <div className="px-4 md:px-8">
        <div className="flex items-center h-16">
          <h1 className="text-xl font-semibold text-slate-800">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};
