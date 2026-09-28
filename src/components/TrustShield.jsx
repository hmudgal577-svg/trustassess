import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { shieldStates, pulseGreen, pulseAmber, pulseRed } from '../animations/variants';

/**
 * TrustShield — Animated shield SVG with state-based color and glow.
 * States: 'healthy' | 'warning' | 'critical' | 'recovering' | 'verified'
 */

const colors = {
  healthy: { fill: '#1D4ED8', accent: '#16A34A', glow: '#16A34A' },
  warning: { fill: '#D97706', accent: '#FCD34D', glow: '#D97706' },
  critical: { fill: '#DC2626', accent: '#FCA5A5', glow: '#DC2626' },
  recovering: { fill: '#2563EB', accent: '#93C5FD', glow: '#2563EB' },
  verified: { fill: '#16A34A', accent: '#86EFAC', glow: '#16A34A' },
};

const glowColors = {
  healthy: 'rgba(22,163,74,0.32)',
  warning: 'rgba(217,119,6,0.45)',
  critical: 'rgba(220,38,38,0.55)',
  recovering: 'rgba(37,99,235,0.45)',
  verified: 'rgba(22,163,74,0.4)',
};

export default function TrustShield({ status = 'healthy', size = 80, showLabel = false }) {
  const prefersReducedMotion = useReducedMotion();
  const palette = colors[status] || colors.healthy;
  const glowColor = glowColors[status] || glowColors.healthy;

  const pulseAnim = prefersReducedMotion ? {} :
    status === 'critical' ? pulseRed :
    status === 'warning' ? pulseAmber :
    pulseGreen;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <motion.div
        animate={!prefersReducedMotion ? shieldStates[status] || shieldStates.healthy : {}}
        whileHover={!prefersReducedMotion ? { scale: 1.08 } : {}}
        style={{ display: 'inline-flex', position: 'relative', cursor: 'default' }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer glow ring */}
        <motion.div
          {...(prefersReducedMotion ? {} : pulseAnim)}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield body */}
          <path
            d="M50 8 L85 22 L85 52 C85 72 68 88 50 94 C32 88 15 72 15 52 L15 22 Z"
            fill={`url(#shieldGrad-${status})`}
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* Inner highlight */}
          <path
            d="M50 16 L77 27 L77 52 C77 68 63 81 50 87 C37 81 23 68 23 52 L23 27 Z"
            fill="white"
            fillOpacity="0.12"
          />

          {/* Check mark or status icon */}
          {(status === 'healthy' || status === 'verified') && (
            <path
              d="M34 50 L44 60 L66 38"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
          {status === 'warning' && (
            <>
              <line x1="50" y1="38" x2="50" y2="56" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <circle cx="50" cy="65" r="3" fill="white" />
            </>
          )}
          {status === 'critical' && (
            <>
              <line x1="40" y1="40" x2="60" y2="60" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="40" x2="40" y2="60" stroke="white" strokeWidth="5" strokeLinecap="round" />
            </>
          )}
          {status === 'recovering' && (
            <path
              d="M40 50 C40 43 55 40 58 50 C61 58 46 64 46 72"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          <defs>
            <linearGradient id={`shieldGrad-${status}`} x1="20" y1="8" x2="80" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={palette.fill} />
              <stop offset="100%" stopColor={palette.accent} stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {showLabel && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: palette.fill,
          }}
        >
          {status === 'healthy' ? 'Secure' :
           status === 'warning' ? 'Warning' :
           status === 'critical' ? 'Critical' :
           status === 'recovering' ? 'Recovering' : 'Verified'}
        </motion.div>
      )}
    </div>
  );
}
