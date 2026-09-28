import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Radio, ShieldCheck } from 'lucide-react';

const statusColors = {
  healthy: '#16A34A',
  warning: '#D97706',
  critical: '#DC2626',
  recovering: '#7C3AED',
};

// Accurate geographical bounds for Madhya Pradesh
// Min Lng: 73.8° E, Max Lng: 83.0° E
// Min Lat: 21.0° N, Max Lat: 27.2° N
function lngToX(lng) {
  return ((lng - 73.8) / (83.0 - 73.8)) * 740 + 30;
}
function latToY(lat) {
  return ((27.2 - lat) / (27.2 - 21.0)) * 520 + 30;
}

// High-precision geographically accurate SVG boundary of Madhya Pradesh
const MP_REALISTIC_BORDER = `
  M 369.4,57.7 
  C 375.0,59.0 380.0,61.0 383.9,61.9 
  C 395.0,65.0 402.0,70.0 408.0,73.6 
  C 424.0,82.0 435.0,85.0 440.2,88.7 
  C 448.0,105.0 452.0,112.0 449.9,118.1 
  C 427.0,133.0 412.0,140.0 404.0,147.4 
  C 392.0,168.0 385.0,180.0 387.9,189.4 
  C 398.0,212.0 405.0,225.0 408.0,235.5 
  C 422.0,258.0 430.0,268.0 436.2,273.2 
  C 448.0,225.0 455.0,195.0 460.3,181.0 
  C 485.0,184.0 500.0,185.0 512.6,187.7 
  C 538.0,198.0 550.0,202.0 560.9,206.1 
  C 580.0,210.0 592.0,212.0 601.1,214.5 
  C 628.0,208.0 642.0,204.0 653.4,201.9 
  C 678.0,225.0 690.0,238.0 697.6,248.1 
  C 728.0,268.0 742.0,278.0 753.9,283.3 
  C 748.0,300.0 742.0,308.0 737.8,315.2 
  C 718.0,330.0 708.0,338.0 697.6,344.5 
  C 680.0,370.0 672.0,385.0 665.4,399.0 
  C 645.0,418.0 635.0,426.0 625.2,432.6 
  C 608.0,444.0 598.0,449.0 589.0,453.5 
  C 570.0,470.0 560.0,479.0 552.8,487.1 
  C 525.0,498.0 510.0,504.0 496.5,508.1 
  C 468.0,512.0 452.0,514.0 440.2,516.5 
  C 404.0,520.0 385.0,522.0 367.8,524.8 
  C 332.0,529.0 315.0,531.0 299.5,533.2 
  C 262.0,538.0 242.0,541.0 224.7,544.1 
  C 193.0,534.0 178.0,529.0 162.7,524.8 
  C 134.0,514.0 120.0,509.0 106.4,503.9 
  C 77.0,482.0 60.0,472.0 47.7,461.9 
  C 56.0,428.0 62.0,410.0 66.2,394.8 
  C 78.0,370.0 85.0,355.0 90.3,344.5 
  C 98.0,311.0 102.0,292.0 106.4,277.4 
  C 98.0,256.0 95.0,244.0 94.3,235.5 
  C 120.0,242.0 135.0,246.0 146.6,249.7 
  C 166.0,268.0 180.0,278.0 190.9,285.8 
  C 218.0,268.0 232.0,259.0 243.2,252.3 
  C 255.0,218.0 262.0,200.0 267.3,185.2 
  C 283.0,152.0 292.0,132.0 299.5,118.1 
  C 315.0,101.0 324.0,92.0 331.6,84.5 
  Z
`.trim();

// Accurate flow path of the Narmada River across Madhya Pradesh
const NARMADA_RIVER = "M 669.5,409.9 C 638.0,402.0 620.0,398.0 605.1,394.8 C 585.0,390.0 575.0,388.0 564.9,386.5 C 545.0,378.0 535.0,374.0 524.7,369.7 C 488.0,380.0 470.0,385.0 452.3,390.6 C 400.0,398.0 370.0,400.0 347.7,403.2 C 310.0,414.0 290.0,419.0 275.3,424.2 C 255.0,435.0 245.0,440.0 235.1,445.2 C 204.0,448.0 188.0,449.0 173.2,451.0 C 145.0,456.0 130.0,459.0 118.5,461.9";

// Geographic Regions for cartographic labels
const REGIONS = [
  { name: 'CHAMBAL', x: 405, y: 100 },
  { name: 'BUNDELKHAND', x: 480, y: 220 },
  { name: 'MALWA PLATEAU', x: 230, y: 340 },
  { name: 'NARMADA VALLEY', x: 380, y: 425 },
  { name: 'MAHAKAUSHAL', x: 570, y: 400 },
  { name: 'VINDHYA & BAGHELKHAND', x: 670, y: 290 },
  { name: 'NIMAR', x: 200, y: 475 },
];

export default function MPMap({ centres = [], onCentreClick }) {
  const [mapMode, setMapMode] = useState('cartographic'); // 'cartographic' | 'satellite'
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  function handleMouseEnter(centre, e) {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    setTooltipPos({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top });
    setTooltip(centre);
  }

  function handleMouseMove(centre, e) {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    setTooltipPos({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top });
  }

  function handleMouseLeave() {
    setTooltip(null);
  }

  function handleClick(centre) {
    onCentreClick && onCentreClick(centre);
  }

  const isSat = mapMode === 'satellite';

  return (
    <div
      className="mp-map-container"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: isSat
          ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #020617 100%)'
          : 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        border: '1px solid var(--border)',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Map Control Bar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          zIndex: 20,
          display: 'flex',
          gap: 6,
          background: isSat ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '4px 6px',
          borderRadius: 20,
          border: '1px solid ' + (isSat ? 'rgba(255,255,255,0.1)' : 'var(--border)'),
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <button
          onClick={() => setMapMode('cartographic')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 14,
            fontSize: 11,
            fontWeight: 600,
            background: !isSat ? 'var(--primary)' : 'transparent',
            color: !isSat ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          <Map size={12} /> Realistic Vector
        </button>
        <button
          onClick={() => setMapMode('satellite')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 14,
            fontSize: 11,
            fontWeight: 600,
            background: isSat ? 'var(--primary)' : 'transparent',
            color: isSat ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          <Layers size={12} /> Satellite Radar
        </button>
      </div>

      <svg ref={svgRef} viewBox="0 0 800 580" className="mp-map-svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
        <defs>
          {/* Gradients */}
          <linearGradient id="mpFillCarto" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="50%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>

          <linearGradient id="mpFillSat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Satellite Background Grid Texture */}
        {isSat && (
          <g opacity="0.15">
            <pattern id="satGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
            </pattern>
            <rect width="800" height="580" fill="url(#satGrid)" />
            <circle cx="400" cy="300" r="280" fill="url(#radarScan)">
              <animate transform="rotate(0 400 300)" attributeName="transform" type="rotate" from="0 400 300" to="360 400 300" dur="12s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Cartographic Latitude / Longitude Grid */}
        <g opacity={isSat ? 0.08 : 0.15}>
          {/* Latitude Lines */}
          <line x1="30" y1="120" x2="770" y2="120" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="40" y="115" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">26° N</text>

          <line x1="30" y1="280" x2="770" y2="280" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="40" y="275" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">24° N</text>

          <line x1="30" y1="450" x2="770" y2="450" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="40" y="445" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">22° N</text>

          {/* Longitude Lines */}
          <line x1="180" y1="30" x2="180" y2="550" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="185" y="565" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">75° E</text>

          <line x1="420" y1="30" x2="420" y2="550" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="425" y="565" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">78° E</text>

          <line x1="650" y1="30" x2="650" y2="550" stroke={isSat ? '#38BDF8' : '#2563EB'} strokeWidth="0.75" strokeDasharray="3 5" />
          <text x="655" y="565" fill={isSat ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">81° E</text>
        </g>

        {/* State Outline Outer Shadow / Glow */}
        <path
          d={MP_REALISTIC_BORDER}
          fill="none"
          stroke={isSat ? '#38BDF8' : '#2563EB'}
          strokeWidth={isSat ? 6 : 4}
          opacity={isSat ? 0.35 : 0.15}
          style={{ filter: 'blur(4px)' }}
        />

        {/* Main Realistic MP State Polygon */}
        <motion.path
          d={MP_REALISTIC_BORDER}
          fill={isSat ? 'url(#mpFillSat)' : 'url(#mpFillCarto)'}
          stroke={isSat ? '#38BDF8' : '#2563EB'}
          strokeWidth={isSat ? 2 : 1.8}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ filter: isSat ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.2))' : 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.12))' }}
        />

        {/* Narmada River Ribbon */}
        <g opacity="0.8">
          <motion.path
            d={NARMADA_RIVER}
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
          />
          <path
            d={NARMADA_RIVER}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          >
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Region Labels */}
        {REGIONS.map((reg) => (
          <text
            key={reg.name}
            x={reg.x}
            y={reg.y}
            textAnchor="middle"
            fill={isSat ? '#64748B' : '#94A3B8'}
            fontSize="9.5"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.12em"
            opacity={isSat ? 0.5 : 0.55}
            pointerEvents="none"
          >
            {reg.name}
          </text>
        ))}

        {/* Narmada River Text Label */}
        <text
          x="360"
          y={latToY(22.6)}
          fill="#0284C7"
          fontSize="9"
          fontWeight="600"
          fontStyle="italic"
          opacity="0.8"
          pointerEvents="none"
        >
          Narmada River →
        </text>

        {/* State Watermark / Header */}
        <text
          x="400"
          y="50"
          textAnchor="middle"
          fill={isSat ? '#E2E8F0' : '#1E3A8A'}
          fontSize="14"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.08em"
          opacity="0.8"
        >
          MADHYA PRADESH ASSESSMENT GRID
        </text>

        {/* Interactive Examination Centres */}
        {centres.map((centre, i) => {
          const cx = lngToX(centre.lng);
          const cy = latToY(centre.lat);
          const color = statusColors[centre.status] || '#64748B';
          const isPulsing = centre.status !== 'healthy';

          return (
            <g
              key={centre.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleMouseEnter(centre, e)}
              onMouseMove={(e) => handleMouseMove(centre, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(centre)}
            >
              {/* Outer Pulsing Wave Ring */}
              {isPulsing && (
                <circle cx={cx} cy={cy} r="16" fill={color} opacity="0.25">
                  <animate attributeName="r" values="8;20;8" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Status Ambient Glow Aura */}
              <circle cx={cx} cy={cy} r="10" fill={color} opacity="0.35" />

              {/* Pin Base Shadow */}
              <ellipse cx={cx} cy={cy + 6} rx="5" ry="2" fill="#000000" opacity="0.2" />

              {/* Main Node Circle */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={7}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={2.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 380, damping: 20 }}
                whileHover={{ scale: 1.5, strokeWidth: 3 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'fill-box' }}
              />

              {/* Inner Core Pulse Dot */}
              <circle cx={cx} cy={cy} r="2.5" fill="#FFFFFF" />

              {/* Centre City Name Label */}
              <motion.text
                x={cx}
                y={cy + 19}
                textAnchor="middle"
                fill={isSat ? '#F8FAFC' : '#0F172A'}
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
                style={{ textShadow: isSat ? '0 1px 4px rgba(0,0,0,0.9)' : '0 1px 3px rgba(255,255,255,0.9)' }}
                initial={{ opacity: 0, y: cy + 24 }}
                animate={{ opacity: 1, y: cy + 19 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                {centre.name}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Cartographic Legend & Status Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          zIndex: 10,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          background: isSat ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '6px 14px',
          borderRadius: 20,
          border: '1px solid ' + (isSat ? 'rgba(255,255,255,0.1)' : 'var(--border)'),
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: isSat ? '#F8FAFC' : 'var(--text-primary)' }}>
          <Radio size={12} style={{ color: 'var(--primary)' }} />
          <span>38 Active Exam Centres</span>
        </div>
        <div style={{ width: 1, height: 12, background: isSat ? '#334155' : '#CBD5E1' }} />
        <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 500 }}>
          {Object.entries(statusColors).map(([status, color]) => (
            <span key={status} style={{ display: 'flex', alignItems: 'center', gap: 4, color: isSat ? '#CBD5E1' : 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ textTransform: 'capitalize' }}>{status}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Floating Detail Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="map-tooltip"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            style={{
              left: Math.min(tooltipPos.x + 14, 550),
              top: Math.max(tooltipPos.y - 110, 10),
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 30,
              minWidth: 190,
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(12px)',
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div className="map-tooltip-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {tooltip.name} Centre
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                  background: (statusColors[tooltip.status] || '#64748B') + '15',
                  color: statusColors[tooltip.status] || '#64748B',
                  textTransform: 'uppercase',
                }}
              >
                {tooltip.status}
              </span>
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'grid', gap: 4, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Candidates:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{tooltip.candidates?.toLocaleString() ?? 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Network Latency:</span>
                <strong style={{ color: tooltip.latency > 30 ? 'var(--warning)' : 'var(--success)' }}>{tooltip.latency} ms</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Local Buffer:</span>
                <strong style={{ color: 'var(--primary)' }}>Protected (0 lost)</strong>
              </div>
            </div>

            <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} /> Click node to view details →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
