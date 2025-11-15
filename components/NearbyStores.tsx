import React, { useState, useEffect } from 'react';
import type { FertilizerRecommendation, NearbyStore, FertilizerProduct } from '../types';
import { stores } from '../data/stores';
import { LoadingSpinner, ExclamationIcon, StorefrontIcon, PhoneIcon, MapPinIcon, StarIcon } from './IconComponents';
import { translations } from '../translations';

interface NearbyStoresProps {
  recommendation: FertilizerRecommendation | null;
  t: (typeof translations)['en-US']['stores'];
}

type Status = 'idle' | 'loading' | 'error' | 'success';

// Haversine formula to calculate distance between two lat/lon points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getRequiredProducts = (recommendation: FertilizerRecommendation): FertilizerProduct[] => {
    const products: Set<FertilizerProduct> = new Set();
    if (recommendation.nutrientAmounts.n > 0) products.add('Urea');
    // Simplified: P can come from SSP or DAP. We'll just check for either.
    if (recommendation.nutrientAmounts.p > 0) {
        products.add('SSP');
        products.add('DAP');
    }
    if (recommendation.nutrientAmounts.k > 0) products.add('MOP');
    if (recommendation.nutrientAmounts.s > 0 || recommendation.nutrientAmounts.zn > 0 || recommendation.nutrientAmounts.fe > 0) {
        products.add('Micronutrients');
    }
    return Array.from(products);
};


export const NearbyStores: React.FC<NearbyStoresProps> = ({ recommendation, t }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([]);
  const [requiredProducts, setRequiredProducts] = useState<FertilizerProduct[]>([]);
  
  useEffect(() => {
    if (recommendation) {
        const products = getRequiredProducts(recommendation);
        setRequiredProducts(products);
        setStatus('loading');
        setError(null);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const foundStores: NearbyStore[] = stores.map(store => ({
                        ...store,
                        distance: getDistance(latitude, longitude, store.lat, store.lon),
                        mapLink: `https://maps.google.com/?q=${store.lat},${store.lon}`
                    }))
                    .filter(store => store.distance <= 10) // Filter within 10km radius
                    .filter(store => products.some(reqProduct => store.products.includes(reqProduct))) // Filter by product availability
                    .sort((a, b) => a.distance - b.distance); // Sort by distance

                    setNearbyStores(foundStores);
                    setStatus('success');
                },
                (geoError) => {
                    setError(t.errorLocation);
                    setStatus('error');
                }
            );
        } else {
            setError(t.errorGeolocation);
            setStatus('error');
        }
    } else {
        setStatus('idle');
    }
  }, [recommendation, t]);
  
  const StoreCard = ({ store }: { store: NearbyStore }) => {
      const availableRequiredProducts = store.products.filter(p => requiredProducts.includes(p));

      return (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                      <h4 className="font-bold text-brand-dark">{store.name}</h4>
                      <p className="text-sm font-semibold text-brand-green">{t.distanceAway(store.distance.toFixed(1))}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm bg-slate-200 px-2 py-1 rounded-full">
                      <StarIcon className="h-4 w-4 text-yellow-500" filled />
                      <span className="font-bold text-slate-700">{store.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">({store.reviewCount})</span>
                  </div>
              </div>
              <div className="mt-3">
                <h5 className="text-xs font-semibold text-slate-500 mb-1">{t.availableProducts}</h5>
                <div className="flex flex-wrap gap-2">
                    {availableRequiredProducts.map(product => (
                        <span key={product} className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">{product}</span>
                    ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t pt-3">
                  <a
                      href={`tel:${store.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus-visible-ring"
                  >
                      <PhoneIcon className="h-4 w-4" /> {t.call}
                  </a>
                  <a
                      href={store.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-brand-green rounded-md hover:bg-green-700 transition-colors focus-visible-ring"
                  >
                      <MapPinIcon className="h-4 w-4" /> {t.directions}
                  </a>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StorefrontIcon className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-brand-dark">{t.placeholder.title}</h3>
            <p className="text-slate-500 mt-2 max-w-md">
              {t.placeholder.subtitle}
            </p>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner className="h-10 w-10 text-brand-green" />
            <p className="ml-4 text-slate-500">{t.loading}</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg" role="alert">
            <ExclamationIcon className="h-8 w-8 mr-3 flex-shrink-0" />
            <p className="text-base font-medium">{error}</p>
          </div>
        );
      case 'success':
        return (
          <div>
            <p className="text-slate-600 mb-4">
              {t.subtitle}
            </p>
            {nearbyStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nearbyStores.map(store => <StoreCard key={store.name} store={store} />)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <ExclamationIcon className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-brand-dark">{t.noStores.title}</h3>
                    <p className="text-slate-500 mt-1 max-w-md">
                        {t.noStores.subtitle}
                    </p>
                </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.title}</h2>
      {renderContent()}
    </div>
  );
};
