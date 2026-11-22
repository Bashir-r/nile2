import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Crosshair, MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { LEBANON_GOVERNORATES } from '../../shared/lebanon.ts';
import type { Locale, StoreLocation } from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';

export const LEBANON_CENTER = { lat: 33.8938, lng: 35.5018 };

export const GOVERNORATE_DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
  beirut: { lat: 33.8938, lng: 35.5018 },
  'mount-lebanon': { lat: 33.9808, lng: 35.6178 },
  north: { lat: 34.4367, lng: 35.8497 },
  south: { lat: 33.5599, lng: 35.3756 },
  bekaa: { lat: 33.8463, lng: 35.902 },
  nabatieh: { lat: 33.3772, lng: 35.4839 },
  akkar: { lat: 34.5506, lng: 36.0797 },
  'baalbek-hermel': { lat: 34.0058, lng: 36.2181 },
};

const LEBANON_BOUNDS = {
  south: 33.05,
  west: 35.1,
  north: 34.7,
  east: 36.65,
};

function PlacesSearchControl({
  locale,
  onPlacePicked,
}: {
  locale: Locale;
  onPlacePicked: (picked: {
    lat: number;
    lng: number;
    address: string;
    label: string;
    placeId: string | null;
  }) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const containerRef = useRef<HTMLDivElement>(null);
  const onPickedRef = useRef(onPlacePicked);
  onPickedRef.current = onPlacePicked;

  useEffect(() => {
    const container = containerRef.current;
    if (!placesLib || !container) return;

    const PlaceAutocompleteCtor = (
      placesLib as unknown as {
        PlaceAutocompleteElement?: new (opts?: Record<string, unknown>) => HTMLElement & {
          locationBias?: unknown;
        };
      }
    ).PlaceAutocompleteElement;

    if (!PlaceAutocompleteCtor) return;

    const el = new PlaceAutocompleteCtor({
      includedRegionCodes: ['LB'],
      requestedLanguage: locale,
    });
    el.locationBias = LEBANON_BOUNDS;
    el.style.width = '100%';
    el.setAttribute('aria-label', locale === 'ar' ? 'ابحث عن عنوان المتجر في لبنان' : 'Search store address in Lebanon');

    const handleSelect = async (event: Event) => {
      const selectEvent = event as CustomEvent<{
        placePrediction?: {
          toPlace: () => {
            location?: { lat: () => number; lng: () => number } | null;
            viewport?: unknown;
            displayName?: string;
            formattedAddress?: string;
            id?: string;
            fetchFields: (opts: { fields: string[] }) => Promise<void>;
          };
        };
      }>;
      const prediction = selectEvent.detail?.placePrediction;
      if (!prediction) return;

      try {
        const place = prediction.toPlace();
        await place.fetchFields({
          fields: ['location', 'viewport', 'displayName', 'formattedAddress', 'id'],
        });
        if (!place.location) return;
        const lat = Number(place.location.lat());
        const lng = Number(place.location.lng());
        if (place.viewport && map) {
          map.fitBounds(place.viewport as Parameters<typeof map.fitBounds>[0]);
        } else if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        onPickedRef.current({
          lat,
          lng,
          label: place.displayName || '',
          address: place.formattedAddress || place.displayName || '',
          placeId: place.id || null,
        });
      } catch (err) {
        const msg = String((err as Error)?.message || err || '');
        if (
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('QuotaExceeded') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      }
    };

    el.addEventListener('gmp-select', handleSelect);
    container.innerHTML = '';
    container.appendChild(el);

    return () => {
      el.removeEventListener('gmp-select', handleSelect);
      if (container.contains(el)) {
        container.removeChild(el);
      }
    };
  }, [placesLib, map, locale]);

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-mono-tabular uppercase text-[var(--muted)]">
        {locale === 'ar' ? 'ابحث عبر خرائط جوجل (لبنان)' : 'Search Google Places (Lebanon)'}
      </p>
      <div
        ref={containerRef}
        className="w-full min-h-[42px] border border-[var(--line)] bg-[var(--ink)] px-2 py-1"
      />
    </div>
  );
}

function MapViewportSync({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center.lat, center.lng]);
  return null;
}

interface StoreLocationManagerProps {
  locations: StoreLocation[];
  defaultGovernorate: string;
  defaultDistrict: string;
  defaultPhone?: string;
  onChange: (next: StoreLocation[]) => void;
}

export function StoreLocationManager({
  locations,
  defaultGovernorate,
  defaultDistrict,
  defaultPhone = '',
  onChange,
}: StoreLocationManagerProps) {
  const { locale, mapsApiKey, showToast } = useMarketplace();
  const initialCoords = GOVERNORATE_DEFAULT_COORDS[defaultGovernorate] || LEBANON_CENTER;

  const [draftLabel, setDraftLabel] = useState(locations.length === 0 ? 'Flagship Showroom' : '');
  const [draftGov, setDraftGov] = useState(defaultGovernorate || 'beirut');
  const [draftDistrict, setDraftDistrict] = useState(defaultDistrict || 'achrafieh');
  const [draftAddress, setDraftAddress] = useState('');
  const [draftPhone, setDraftPhone] = useState(defaultPhone);
  const [draftHours, setDraftHours] = useState('Mon–Sat 09:30–19:00');
  const [draftLat, setDraftLat] = useState<number>(initialCoords.lat);
  const [draftLng, setDraftLng] = useState<number>(initialCoords.lng);
  const [draftPlaceId, setDraftPlaceId] = useState<string | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);

  const activeGov = LEBANON_GOVERNORATES.find((g) => g.code === draftGov) || LEBANON_GOVERNORATES[0];

  const handleGovernorateChange = (code: string) => {
    setDraftGov(code);
    const gov = LEBANON_GOVERNORATES.find((g) => g.code === code);
    if (gov?.districts[0]) {
      setDraftDistrict(gov.districts[0].code);
    }
    const coords = GOVERNORATE_DEFAULT_COORDS[code];
    if (coords) {
      setDraftLat(coords.lat);
      setDraftLng(coords.lng);
    }
  };

  const handleUseMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      showToast(locale === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Browser geolocation is unavailable', 'error');
      return;
    }
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDraftLat(Number(pos.coords.latitude.toFixed(6)));
        setDraftLng(Number(pos.coords.longitude.toFixed(6)));
        setLocatingGps(false);
        showToast(locale === 'ar' ? 'تم تحديد الإحداثيات الحالية' : 'Pinned your current coordinates', 'success');
      },
      () => {
        setLocatingGps(false);
        showToast(locale === 'ar' ? 'تعذر الوصول للموقع' : 'Unable to read device GPS coordinates', 'error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleAddLocation = () => {
    if (!Number.isFinite(draftLat) || !Number.isFinite(draftLng)) {
      showToast('Valid latitude and longitude coordinates are required.', 'error');
      return;
    }
    const cleanLabel = draftLabel.trim() || `${activeGov.name.en} Branch`;
    const newLoc: StoreLocation = {
      id: `loc-${Date.now().toString(36)}`,
      label: cleanLabel,
      address: draftAddress.trim() || `${activeGov.name.en}, ${draftDistrict}`,
      governorate: draftGov,
      district: draftDistrict,
      lat: Number(draftLat.toFixed(6)),
      lng: Number(draftLng.toFixed(6)),
      placeId: draftPlaceId,
      phone: draftPhone.trim() || null,
      hours: draftHours.trim() || null,
      isPrimary: locations.length === 0,
    };
    onChange([...locations, newLoc]);
    setDraftLabel('');
    setDraftAddress('');
    setDraftPlaceId(null);
    showToast(locale === 'ar' ? 'تمت إضافة الفرع. احفظ الإعدادات لتثبيته.' : 'Branch added. Save storefront settings to publish.', 'info');
  };

  const handleSetPrimary = (id: string) => {
    onChange(locations.map((loc) => ({ ...loc, isPrimary: loc.id === id })));
  };

  const handleRemove = (id: string) => {
    const filtered = locations.filter((loc) => loc.id !== id);
    if (filtered.length > 0 && !filtered.some((loc) => loc.isPrimary)) {
      filtered[0] = { ...filtered[0], isPrimary: true };
    }
    onChange(filtered);
  };

  return (
    <div className="border border-[var(--line)] bg-[var(--ink)] p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <div>
          <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--cedar)]">
            {locale === 'ar' ? 'مواقع الفروع على الخريطة' : 'Physical Storefront & Pickup Locations'}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {locale === 'ar'
              ? 'ابحث عن عنوان متجرك أو اسحب الدبوس لتحديد الموقع الدقيق أمام المشترين.'
              : 'Search via Google Places or click/drag the pin to publish verified store coordinates for buyers.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locatingGps}
          className="px-3 py-1.5 border border-[var(--line)] text-xs font-mono-tabular text-[var(--bone)] hover:border-[var(--ember)] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Crosshair className="w-3.5 h-3.5 text-[var(--ember)]" aria-hidden="true" />
          <span>{locatingGps ? 'Locating...' : locale === 'ar' ? 'موقعي الحالي' : 'Use Current GPS'}</span>
        </button>
      </div>

      {mapsApiKey ? (
        <APIProvider apiKey={mapsApiKey} language={locale} region="LB" libraries={['places', 'marker']}>
          <PlacesSearchControl
            locale={locale}
            onPlacePicked={(picked) => {
              setDraftLat(Number(picked.lat.toFixed(6)));
              setDraftLng(Number(picked.lng.toFixed(6)));
              if (picked.address) setDraftAddress(picked.address);
              if (!draftLabel.trim() && picked.label) setDraftLabel(picked.label);
              setDraftPlaceId(picked.placeId);
            }}
          />
          <div className="w-full h-[340px] border border-[var(--line)] bg-[var(--graphite)] overflow-hidden relative">
            <GoogleMap
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={{ lat: draftLat, lng: draftLng }}
              defaultZoom={12}
              gestureHandling="greedy"
              streetViewControl={false}
              mapTypeControl={false}
              onClick={(ev) => {
                const latLng = ev.detail?.latLng;
                if (latLng) {
                  setDraftLat(Number(latLng.lat.toFixed(6)));
                  setDraftLng(Number(latLng.lng.toFixed(6)));
                  setDraftPlaceId(null);
                }
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <MapViewportSync center={{ lat: draftLat, lng: draftLng }} />
              <AdvancedMarker
                position={{ lat: draftLat, lng: draftLng }}
                draggable
                onDragEnd={(ev) => {
                  const pos = ev.latLng;
                  if (pos) {
                    setDraftLat(Number(pos.lat().toFixed(6)));
                    setDraftLng(Number(pos.lng().toFixed(6)));
                    setDraftPlaceId(null);
                  }
                }}
                title={draftLabel || 'New Branch Pin'}
              >
                <Pin background="#D94E28" glyphColor="#FFFFFF" borderColor="#141518" />
              </AdvancedMarker>
              {locations.map((loc) => (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  title={loc.label}
                >
                  <Pin
                    background={loc.isPrimary ? '#2C7A5B' : '#1C1D21'}
                    glyphColor="#FFFFFF"
                    borderColor="#FFFFFF"
                  />
                </AdvancedMarker>
              ))}
            </GoogleMap>
          </div>
        </APIProvider>
      ) : (
        <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 text-xs text-[var(--muted)] space-y-1">
          <p className="text-[var(--bone)] font-semibold">
            {locale === 'ar'
              ? 'إدخال الإحداثيات المباشر (أضف VITE_GOOGLE_MAPS_API_KEY لتفعيل الخريطة التفاعلية)'
              : 'Direct Coordinate Mode (Configure VITE_GOOGLE_MAPS_API_KEY in your environment for interactive map pin & Places search)'}
          </p>
          <p>
            {locale === 'ar'
              ? 'يمكنك إضافة الفروع وإحداثياتها أدناه، وسيتم حفظها وعرضها في Schema.org وروابط الاتجاهات.'
              : 'You can add branches and coordinates below; locations still persist to your storefront JSON-LD and directions links.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Branch Label</span>
          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="e.g. Gemmayze Atelier"
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
          />
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Governorate</span>
          <select
            value={draftGov}
            onChange={(e) => handleGovernorateChange(e.target.value)}
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
          >
            {LEBANON_GOVERNORATES.map((g) => (
              <option key={g.code} value={g.code}>
                {g.name[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">District</span>
          <select
            value={draftDistrict}
            onChange={(e) => setDraftDistrict(e.target.value)}
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
          >
            {activeGov.districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Street / Building Address</span>
          <input
            type="text"
            value={draftAddress}
            onChange={(e) => setDraftAddress(e.target.value)}
            placeholder="Gouraud St, Bldg 14, Ground Floor"
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
          />
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Branch Phone</span>
          <input
            type="text"
            value={draftPhone}
            onChange={(e) => setDraftPhone(e.target.value)}
            placeholder="+961 1 555 010"
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
          />
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Opening Hours</span>
          <input
            type="text"
            value={draftHours}
            onChange={(e) => setDraftHours(e.target.value)}
            placeholder="Mon-Sat 09:30-19:00"
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
          />
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Latitude</span>
          <input
            type="number"
            step="0.000001"
            value={draftLat}
            onChange={(e) => setDraftLat(Number(e.target.value))}
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
          />
        </label>

        <label className="space-y-1">
          <span className="font-mono-tabular uppercase text-[var(--muted)]">Longitude</span>
          <input
            type="number"
            step="0.000001"
            value={draftLng}
            onChange={(e) => setDraftLng(Number(e.target.value))}
            className="w-full bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleAddLocation}
        className="px-4 py-2 border border-[var(--cedar)] bg-[var(--graphite)] text-xs font-semibold uppercase tracking-wider text-[var(--cedar)] hover:bg-[var(--cedar)] hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{locale === 'ar' ? 'إضافة الفرع إلى المتجر' : 'Add Branch Pin'}</span>
      </button>

      {locations.length > 0 && (
        <div className="divide-y divide-[var(--line)] border border-[var(--line)] bg-[var(--graphite)]">
          {locations.map((loc) => (
            <div key={loc.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--ember)] shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-[var(--bone)]">{loc.label}</span>
                  {loc.isPrimary && (
                    <span className="px-1.5 py-0.5 border border-[var(--cedar)] text-[10px] font-mono-tabular uppercase text-[var(--cedar)]">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[var(--muted)]">
                  {loc.address} · {loc.governorate} / {loc.district}
                  {loc.hours ? ` · ${loc.hours}` : ''}
                </p>
                <p className="font-mono-tabular text-[11px] text-[var(--muted)]">
                  {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                  {loc.phone ? ` · ${loc.phone}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!loc.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(loc.id)}
                    className="px-2.5 py-1 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Star className="w-3 h-3" aria-hidden="true" />
                    <span>Set Primary</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(loc.id)}
                  aria-label={`Remove ${loc.label}`}
                  className="px-2.5 py-1 border border-[var(--line)] text-[var(--ember)] hover:border-[var(--ember)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
