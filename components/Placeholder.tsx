import React from 'react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
      <div className="text-center max-w-lg">
        {icon}
        <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
        <p className="text-slate-500 mt-2 mb-4">{description}</p>
        <p className="text-lg font-semibold text-brand-green bg-green-50 px-4 py-2 rounded-full inline-block">
          Feature Coming Soon!
        </p>
      </div>
    </div>
  );
};