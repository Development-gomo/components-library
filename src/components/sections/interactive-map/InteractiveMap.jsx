'use client';

// Layout: interactive_map
// ACF Fields:
//   background_color  (color_picker)
//   text_color        (color_picker)   — section heading/text color
//   accent_color      (color_picker)   — pin + highlight color, default #00fec3
//   section_title     (text)           — eyebrow label
//   heading           (text)
//   description       (wysiwyg)
//   map_tile          (select: dark | light)   — default: dark
//   map_height        (number)                 — px height, default 600
//   locations         (repeater)
//     location_name        (text)
//     location_address     (textarea)
//     location_phone       (text)
//     location_email       (email)
//     location_region      (text)      — populates dropdown filter e.g. Europe, Americas
//     location_lat         (text)      — decimal latitude  e.g. 51.5074
//     location_lng         (text)      — decimal longitude e.g. -0.1278
//     is_headquarters      (true_false)
//   custom_class      (text)
//   custom_id         (text)

import dynamic from 'next/dynamic';
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Leaflet map — no SSR
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
      <div className="flex flex-col items-center gap-3 opacity-40">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00fec3" strokeWidth="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span style={{ color: '#00fec3', fontSize: 13 }}>Loading map…</span>
      </div>
    </div>
  ),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex = '') {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '0,254,195';
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.1 },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

// ─── Section header (above the map box) ──────────────────────────────────────

function SectionHeader({ sectionTitle, heading, description, textColor, accentColor }) {
  if (!sectionTitle && !heading && !description) return null;
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {sectionTitle && (
        <motion.div {...up(0)} className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
            {sectionTitle}
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        </motion.div>
      )}
      {heading && (
        <motion.h2
          {...up(0.06)}
          className="text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight"
          style={{ color: textColor }}
        >
          {heading}
        </motion.h2>
      )}
      {heading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 h-0.5 w-16 rounded-full origin-center"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
      )}
      {description && (
        <motion.div
          {...up(0.14)}
          className="mt-4 text-base md:text-lg leading-relaxed"
          style={{ color: textColor, opacity: 0.55 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

// ─── Location row inside left panel ──────────────────────────────────────────

function LocationRow({ loc, active, accentColor, onClick }) {
  const rgb = hexToRgb(accentColor);
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-4 border-b transition-all duration-200 flex items-start gap-3',
        active ? 'bg-white/8' : 'hover:bg-white/5'
      )}
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {/* Pin dot */}
      <span
        className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
        style={{
          backgroundColor: active ? accentColor : 'rgba(255,255,255,0.25)',
          boxShadow: active ? `0 0 8px ${accentColor}` : 'none',
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white leading-snug">{loc.location_name}</span>
          {loc.is_headquarters && (
            <span
              className="text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              HQ
            </span>
          )}
        </div>
        {loc.location_address && (
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {loc.location_address}
          </p>
        )}
        {active && (
          <p className="text-xs mt-1.5" style={{ color: accentColor, opacity: 0.7 }}>
            Click pin on map for details
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function InteractiveMap({ data = {} }) {
  const {
    background_color = '',
    text_color        = '#1a1a1a',
    accent_color      = '#00fec3',
    section_title     = '',
    heading           = '',
    description       = '',
    map_tile          = 'colorful',
    map_height        = 600,
    locations         = [],
    custom_class      = '',
    custom_id         = '',
  } = data;

  const accent  = accent_color || '#00fec3';
  const rgb     = hexToRgb(accent);
  const height  = Number(map_height) || 600;

  const [activeIndex, setActiveIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build unique region list for the dropdown
  const regions = useMemo(() => {
    const set = new Set(locations.map(l => l.location_region).filter(Boolean));
    return [...set];
  }, [locations]);

  const allOptions = [{ value: 'all', label: 'All Locations' }, ...regions.map(r => ({ value: r, label: r }))];
  const activeLabel = allOptions.find(o => o.value === filter)?.label || 'All Locations';

  const filtered = useMemo(() => {
    if (filter === 'all') return locations.map((l, i) => ({ ...l, _orig: i }));
    return locations.map((l, i) => ({ ...l, _orig: i })).filter(l => l.location_region === filter);
  }, [locations, filter]);

  const handleSelect = (origIndex) => {
    setActiveIndex(prev => prev === origIndex ? null : origIndex);
  };

  const handleFilterChange = (val) => {
    setFilter(val);
    setActiveIndex(null);
    setDropdownOpen(false);
  };

  return (
    <section
      id={custom_id || undefined}
      className={cn('relative py-24 md:py-32 px-4 overflow-hidden', custom_class)}
      style={background_color ? { backgroundColor: background_color, color: text_color } : { color: text_color }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${rgb},0.05) 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="web-width mx-auto relative z-10">
        <SectionHeader
          sectionTitle={section_title}
          heading={heading}
          description={description}
          textColor={text_color}
          accentColor={accent}
        />

        {/* Map box */}
        <motion.div
          {...up(0.1)}
          className="rounded-2xl overflow-hidden flex flex-col md:flex-row"
          style={{
            height,
            border: `1px solid rgba(${rgb},0.18)`,
            boxShadow: `0 24px 64px rgba(${rgb},0.08)`,
          }}
        >
          {/* ── Left panel ── */}
          <div
            className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col"
            style={{ background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Custom dropdown */}
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }} ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-full flex items-center justify-between text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200"
                  style={{
                    background: dropdownOpen ? `rgba(${rgb},0.15)` : 'rgba(255,255,255,0.06)',
                    border: `1px solid rgba(${rgb},${dropdownOpen ? '0.5' : '0.25'})`,
                    color: '#fff',
                  }}
                >
                  <span>{activeLabel}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
                    style={{ background: '#1a1a1a', border: `1px solid rgba(${rgb},0.3)`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  >
                    {allOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleFilterChange(opt.value)}
                        className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150"
                        style={{
                          color: filter === opt.value ? accent : 'rgba(255,255,255,0.75)',
                          background: filter === opt.value ? `rgba(${rgb},0.12)` : 'transparent',
                          fontWeight: filter === opt.value ? 600 : 400,
                        }}
                        onMouseEnter={e => { if (filter !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (filter !== opt.value) e.currentTarget.style.background = 'transparent'; }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location list */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${accent}40 transparent` }}>
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-white/30 text-center">No locations found</p>
              )}
              {filtered.map((loc) => (
                <LocationRow
                  key={loc._orig}
                  loc={loc}
                  active={activeIndex === loc._orig}
                  accentColor={accent}
                  onClick={() => handleSelect(loc._orig)}
                />
              ))}
            </div>

            {/* Footer count */}
            <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {filtered.length} {filtered.length === 1 ? 'location' : 'locations'}
              </span>
            </div>
          </div>

          {/* ── Map ── */}
          <div className="flex-1 relative">
            <MapView
              locations={filtered}
              activeIndex={activeIndex}
              accentColor={accent}
              tileStyle={map_tile}
              onMarkerClick={(idx) => handleSelect(filtered[idx]?._orig ?? idx)}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
