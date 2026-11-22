import React, { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { Seller, StoreLocation } from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { GOVERNORATE_DEFAULT_COORDS, LEBANON_CENTER } from './StoreLocationManager.tsx';

export interface StoreMapEntry {
  key: string;
  seller: Seller;
  location: StoreLocation;
  isExactPin: boolean;
}

function buildDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;
}

function FitBoundsEffect({ entries }: { entries: StoreMapEntry[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || entries.length === 0) return;
    if (entries.length === 1) {
      map.panTo({ lat: entries[0].location.lat, lng: entries[0].location.lng });
      map.setZoom(entries[0].isExactPin ? 14 : 11);
      return;
    }
    const gMaps = (
      window as unknown as {
        google?: {
          maps?: {
            LatLngBounds?: new () => { extend: (pt: { lat: number; lng: number }) => void };
          };
        };
      }
    ).google?.maps;
    if (!gMaps?.LatLngBounds) return;
    const bounds = new gMaps.LatLngBounds();
    for (const entry of entries) {
      bounds.extend({ lat: entry.location.lat, lng: entry.location.lng });
    }
    map.fitBounds(bounds as unknown as Parameters<typeof map.fitBounds>[0], 48);
  }, [map, entries]);
  return null;
}

function MarkerWithWindow({
  entry,
  isSelected,
  onSelect,
  onNavigateStore,
  locale,
}: {
  entry: StoreMapEntry;
  isSelected: boolean;
  onSelect: () => void;
  onNavigateStore: (slug: string) => void;
  locale: 'en' | 'ar';
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: entry.location.lat, lng: entry.location.lng }}
        onClick={onSelect}
        title={`${entry.seller.name[locale]} — ${entry.location.label}`}
      >
        <Pin
          background={isSelected ? '#D94E28' : entry.isExactPin ? '#2C7A5B' : '#4B5563'}
          glyphColor="#FFFFFF"
          borderColor="#141518"
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onSelect}>
          <div className="text-neutral-900 text-xs max-w-[240px] space-y-1.5 p-0.5">
            <p className="font-bold text-sm">{entry.seller.name[locale]}</p>
            <p className="font-semibold text-neutral-700">{entry.location.label}</p>
            <p className="text-neutral-600">{entry.location.address}</p>
            {entry.location.hours && <p className="text-neutral-500">{entry.location.hours}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigateStore(entry.seller.slug)}
                className="font-semibold underline text-emerald-700 cursor-pointer"
              >
                {locale === 'ar' ? 'زيارة المتجر' : 'Visit Store'}
              </button>
              <a
                href={buildDirectionsUrl(entry.location.lat, entry.location.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline text-orange-700"
              >
                {locale === 'ar' ? 'الاتجاهات' : 'Directions'}
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function StoreLocationsMap({
  sellers,
  heightClass = 'h-[360px]',
  showDirectoryList = true,
}: {
  sellers: Seller[];
  heightClass?: string;
  showDirectoryList?: boolean;
}) {
  const { locale, mapsApiKey, navigate } = useMarketplace();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const entries = useMemo<StoreMapEntry[]>(() => {
    const out: StoreMapEntry[] = [];
    for (const s of sellers) {
      const locs = s.locations || [];
      if (locs.length > 0) {
        for (const loc of locs) {
          out.push({
            key: `${s.id}::${loc.id}`,
            seller: s,
            location: loc,
            isExactPin: true,
          });
        }
      } else {
        const fallback = GOVERNORATE_DEFAULT_COORDS[s.governorate] || LEBANON_CENTER;
        out.push({
          key: `${s.id}::gov`,
          seller: s,
          location: {
            id: 'gov-default',
            label: `${s.governorate} · ${s.district}`,
            address: s.cityAddress || `${s.district}, ${s.governorate}`,
            governorate: s.governorate,
            district: s.district,
            lat: fallback.lat,
            lng: fallback.lng,
            isPrimary: true,
          },
          isExactPin: false,
        });
      }
    }
    return out;
  }, [sellers]);

  const initialCenter = entries[0]
    ? { lat: entries[0].location.lat, lng: entries[0].location.lng }
    : LEBANON_CENTER;

  return (
    <div className="space-y-4">
      {mapsApiKey ? (
        <APIProvider apiKey={mapsApiKey} language={locale} region="LB" libraries={['marker']}>
          <div className={`w-full ${heightClass} border border-[var(--line)] bg-[var(--graphite)] overflow-hidden`}>
            <GoogleMap
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={initialCenter}
              defaultZoom={entries.length <= 1 ? 13 : 9}
              gestureHandling="cooperative"
              streetViewControl={false}
              style={{ width: '100%', height: '100%' }}
            >
              <FitBoundsEffect entries={entries} />
              {entries.map((entry) => (
                <MarkerWithWindow
                  key={entry.key}
                  entry={entry}
                  isSelected={selectedKey === entry.key}
                  onSelect={() => setSelectedKey((curr) => (curr === entry.key ? null : entry.key))}
                  onNavigateStore={(slug) => navigate(`/store/${slug}`)}
                  locale={locale}
                />
              ))}
            </GoogleMap>
          </div>
        </APIProvider>
      ) : null}

      {showDirectoryList && entries.length > 0 && (
        <div className="hairline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const selected = selectedKey === entry.key;
            return (
              <div
                key={entry.key}
                className={`hairline-cell p-4 space-y-2 transition-colors ${
                  selected ? 'bg-[var(--ink)]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate(`/store/${entry.seller.slug}`)}
                      className="editorial-link text-sm font-semibold text-[var(--bone)] text-start cursor-pointer"
                    >
                      {entry.seller.name[locale]}
                    </button>
                    <p className="text-xs font-medium text-[var(--ember)] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{entry.location.label}</span>
                    </p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 border text-[10px] font-mono-tabular uppercase ${
                      entry.isExactPin
                        ? 'border-[var(--cedar)] text-[var(--cedar)]'
                        : 'border-[var(--line)] text-[var(--muted)]'
                    }`}
                  >
                    {entry.isExactPin ? 'Verified Pin' : 'Zone Area'}
                  </span>
                </div>

                <p className="text-xs text-[var(--muted)]">{entry.location.address}</p>
                {(entry.location.hours || entry.location.phone) && (
                  <p className="text-[11px] font-mono-tabular text-[var(--muted)]">
                    {[entry.location.hours, entry.location.phone].filter(Boolean).join(' · ')}
                  </p>
                )}

                <div className="flex items-center gap-4 pt-1 text-xs">
                  {mapsApiKey && (
                    <button
                      type="button"
                      onClick={() => setSelectedKey(entry.key)}
                      className="text-[var(--bone)] hover:text-[var(--ember)] underline cursor-pointer"
                    >
                      {locale === 'ar' ? 'تحديد على الخريطة' : 'Highlight on Map'}
                    </button>
                  )}
                  <a
                    href={buildDirectionsUrl(entry.location.lat, entry.location.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--cedar)] hover:underline"
                  >
                    <Navigation className="w-3 h-3" aria-hidden="true" />
                    <span>{locale === 'ar' ? 'الاتجاهات' : 'Google Maps Directions'}</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
