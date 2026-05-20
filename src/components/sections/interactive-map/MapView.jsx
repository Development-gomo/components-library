'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix broken default icons in Next.js / webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom pin icon ──────────────────────────────────────────────────────────

function createPin(accentColor, isHQ = false, isActive = false) {
  const size   = isHQ ? 36 : 28;
  const border = isActive ? 3 : 0;
  const shadow = isActive
    ? `drop-shadow(0 0 8px ${accentColor})`
    : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`;

  const html = `
    <div style="
      width:${size}px;
      height:${size + 8}px;
      filter:${shadow};
      transform-origin: bottom center;
      transition: transform 0.2s ease;
    ">
      <svg viewBox="0 0 36 44" width="${size}" height="${size + 8}" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.059 27.941 0 18 0z"
          fill="${accentColor}" opacity="${isActive ? 1 : 0.9}" />
        <circle cx="18" cy="18" r="${isHQ ? 7 : 5}" fill="rgba(0,0,0,0.55)" />
        ${isHQ ? `<circle cx="18" cy="18" r="3" fill="${accentColor}" />` : ''}
      </svg>
    </div>`;

  return L.divIcon({
    html,
    className:   '',
    iconSize:    [size, size + 8],
    iconAnchor:  [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

// ─── Fly-to controller ────────────────────────────────────────────────────────

function FlyTo({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([parseFloat(location.lat), parseFloat(location.lng)], 12, { duration: 1.2 });
    }
  }, [location, map]);
  return null;
}

// ─── Fit-bounds controller (fires when filter changes) ────────────────────────

function FitBounds({ locs }) {
  const map = useMap();
  const prevKey = useRef(null);

  useEffect(() => {
    if (!locs.length) return;
    const key = locs.map(l => `${l.lat},${l.lng}`).join('|');
    if (key === prevKey.current) return; // same set — don't re-fit
    prevKey.current = key;

    if (locs.length === 1) {
      map.flyTo([locs[0].lat, locs[0].lng], 12, { duration: 1.2 });
    } else {
      const bounds = L.latLngBounds(locs.map(l => [l.lat, l.lng]));
      map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
    }
  }, [locs, map]);

  return null;
}

// ─── Map component ────────────────────────────────────────────────────────────

export default function MapView({ locations = [], activeIndex, accentColor = '#00fec3', tileStyle = 'colorful', onMarkerClick }) {
  const validLocs = locations.map((l, i) => ({
    ...l,
    _index: l._orig ?? i,
    lat: parseFloat(l.location_lat),
    lng: parseFloat(l.location_lng),
  })).filter(l => !isNaN(l.lat) && !isNaN(l.lng));

  const activeLocation = activeIndex !== null ? validLocs.find(l => l._index === activeIndex) : null;

  const tileUrl =
    tileStyle === 'dark'  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
    tileStyle === 'light' ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' :
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; // colorful default

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {validLocs.map((loc) => (
        <Marker
          key={loc._index}
          position={[loc.lat, loc.lng]}
          icon={createPin(accentColor, !!loc.is_headquarters, activeIndex === loc._index)}
          eventHandlers={{ click: () => onMarkerClick?.(loc._index) }}
        >
          <Popup minWidth={220} maxWidth={280}>
            <div style={{ fontFamily: 'inherit', padding: '2px 0' }}>
              {/* Accent top bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`, borderRadius: '4px 4px 0 0', margin: '-4px -12px 10px' }} />

              {/* Name + HQ badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <strong style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{loc.location_name}</strong>
                {loc.is_headquarters && (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', background: accentColor, color: '#000', padding: '2px 6px', borderRadius: 20 }}>
                    HQ
                  </span>
                )}
              </div>

              {/* Address */}
              {loc.location_address && (
                <p style={{ fontSize: 12, color: '#555', margin: '0 0 10px', lineHeight: 1.5 }}>{loc.location_address}</p>
              )}

              {/* Divider */}
              {(loc.location_phone || loc.location_email) && (
                <div style={{ height: 1, background: '#e5e5e5', margin: '8px 0' }} />
              )}

              {/* Phone */}
              {loc.location_phone && (
                <a
                  href={`tel:${loc.location_phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: accentColor, textDecoration: 'none', marginBottom: 5, fontWeight: 500 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.25 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {loc.location_phone}
                </a>
              )}

              {/* Email */}
              {loc.location_email && (
                <a
                  href={`mailto:${loc.location_email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: accentColor, textDecoration: 'none', fontWeight: 500 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {loc.location_email}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Fly to active pin — triggered by card click */}
      {activeLocation && <FlyTo location={activeLocation} />}

      {/* Fit bounds to all visible pins — triggered when filter/locations change */}
      {!activeLocation && <FitBounds locs={validLocs} />}
    </MapContainer>
  );
}
