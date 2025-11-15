import React, { useState, useEffect } from 'react';
import { getFinancialMarketData, handleApiError } from '../services/geminiService';
import { CropType, FinancialData } from '../types';
import { FinancialIcon, LoadingSpinner, ExclamationIcon } from './IconComponents';
import { translations } from '../translations';

interface FinancialDashboardProps {
  t: (typeof translations)['en-US']['financial'];
}

const TrendIndicator = ({ trend, t }: { trend: 'Rising' | 'Stable' | 'Falling', t: (typeof translations)['en-US']['financial'] }) => {
    const trendConfig = {
        Rising: { text: `▲ ${t.rising}`, color: 'text-green-600', bg: 'bg-green-100' },
        Stable: { text: `— ${t.stable}`, color: 'text-slate-600', bg: 'bg-slate-100' },
        Falling: { text: `▼ ${t.falling}`, color: 'text-red-600', bg: 'bg-red-100' },
    };
    const { text, color, bg } = trendConfig[trend];
    return <span className={`px-3 py-1 text-sm font-bold rounded-full ${color} ${bg}`}>{text}</span>;
}

const PriceChart = ({ data, t }: { data: { month: string, price: number }[], t: (typeof translations)['en-US']['financial'] }) => {
    if (!data || data.length === 0) return null;

    const maxPrice = Math.max(...data.map(d => d.price));
    const minPrice = Math.min(...data.map(d => d.price));
    const range = maxPrice - minPrice;
    
    // Handle case where all prices are the same
    const getBarHeight = (price: number) => {
      if (range === 0) return '50%';
      return `${((price - minPrice) / range) * 80 + 20}%`; // 20% is min height
    };
    
    return (
        <div className="p-4 bg-slate-50 rounded-lg h-full">
             <h4 className="font-semibold text-slate-700 mb-4 text-center">{t.chart3Month}</h4>
            <div className="flex justify-around items-end h-48">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-1/4">
                        <div className="text-sm font-bold text-slate-800 mb-1">₹{item.price}</div>
                        <div
                            className="w-12 bg-brand-green rounded-t-md"
                            style={{ height: getBarHeight(item.price) }}
                            title={`Price: ₹${item.price}`}
                        ></div>
                        <div className="mt-2 text-xs font-semibold text-slate-500">{item.month}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PieChart = ({ data, t }: { data: { crop: string, percentage: number }[], t: (typeof translations)['en-US']['financial'] }) => {
    if (!data || data.length === 0) return null;

    const colors = ['#22c55e', '#84cc16', '#f97316', '#3b82f6', '#ec4899'];
    let gradientParts: string[] = [];
    let accumulatedPercentage = 0;

    data.forEach((slice, index) => {
        gradientParts.push(`${colors[index % colors.length]} ${accumulatedPercentage}% ${accumulatedPercentage + slice.percentage}%`);
        accumulatedPercentage += slice.percentage;
    });

    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="p-4 bg-slate-50 rounded-lg h-full">
            <h4 className="font-semibold text-slate-700 mb-4 text-center">{t.chartRevenue}</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div
                    className="w-36 h-36 rounded-full animate-fade-in flex-shrink-0"
                    style={{ background: conicGradient }}
                    role="img"
                    aria-label={`Pie chart showing revenue contribution: ${data.map(d => `${d.crop} ${d.percentage}%`).join(', ')}`}
                ></div>
                <ul className="space-y-2 text-sm">
                    {data.map((slice, index) => (
                        <li key={slice.crop} className="flex items-center">
                            <span className="w-4 h-4 rounded-sm mr-2 flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></span>
                            <span className="font-semibold text-slate-700">{slice.crop}:</span>
                            <span className="ml-1 text-slate-600">{slice.percentage}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ t }) => {
    const [selectedCrop, setSelectedCrop] = useState<CropType | ''>('');
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchData = async (crop: CropType) => {
        if (!crop) return;
        setIsLoading(true);
        setError(null);
        setFinancialData(null);
        try {
            const data = await getFinancialMarketData(crop);
            setFinancialData(data);
        } catch (err) {
            const processedError = handleApiError(err);
            setError(processedError.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const crop = e.target.value as CropType;
        setSelectedCrop(crop);
        handleFetchData(crop);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
            
            <div className="max-w-md">
                <label htmlFor="crop-select" className="block text-sm font-medium text-slate-700">{t.selectCrop}</label>
                <select
                    id="crop-select"
                    value={selectedCrop}
                    onChange={handleCropChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md focus-visible-ring"
                >
                    <option value="" disabled>{t.chooseCrop}</option>
                    {Object.values(CropType).map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner className="h-10 w-10 text-brand-green" />
                    <p className="ml-4 text-slate-500">{t.loading}</p>
                </div>
            )}

            {error && (
                <div className="mt-6 flex items-center text-red-600 bg-red-50 p-4 rounded-lg" role="alert">
                    <ExclamationIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
            
            {!isLoading && !financialData && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FinancialIcon className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-brand-dark">{t.placeholder.title}</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">
                        {t.placeholder.subtitle}
                    </p>
                </div>
            )}

            {financialData && (
                <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-800">{t.currentPrice(financialData.currentPrice.source)}</p>
                            <p className="text-3xl font-bold text-green-900">
                                ₹{financialData.currentPrice.price.toLocaleString('en-IN')}
                                <span className="text-lg font-medium text-green-700"> {t.perUnit(financialData.currentPrice.unit)}</span>
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-center items-center">
                            <p className="text-sm font-medium text-slate-600 mb-2">{t.trend}</p>
                            <TrendIndicator trend={financialData.priceTrend} t={t}/>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-slate-700">{t.insights}</h4>
                        <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{financialData.marketInsights}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PriceChart data={financialData.historicalData} t={t} />
                        <PieChart data={financialData.revenueContribution} t={t} />
                    </div>
                </div>
            )}
        </div>
    );
};
