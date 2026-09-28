import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Hero3D — Premium 3D visual asset with floating animation.
 * Used on the Dashboard hero section.
 * Respects prefers-reduced-motion.
 */
export default function Hero3D({ className }) {
  const prefersReducedMotion = useReducedMotion();

  const floatProps = prefersReducedMotion
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: {
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
      };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26, delay: 0.1 }}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Main hero image with float */}
      <motion.img
        src="/assets/3d/trust-hero.jpg"
        alt="TrustAssess secure exam platform illustration"
        {...floatProps}
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          objectFit: 'cover',
          display: 'block',
          filter: 'drop-shadow(0 20px 40px rgba(37,99,235,0.14))',
        }}
      />

      {/* Floating status badge — top right */}
      <motion.div
        initial={{ opacity: 0, x: 12, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 280 }}
        {...(prefersReducedMotion ? {} : {
          animate: { y: [0, -4, 0], opacity: 1 },
          transition: { delay: 0.55, duration: 5, repeat: Infinity, ease: 'easeInOut' },
        })}
        style={{
          position: 'absolute',
          top: 16,
          right: -10,
          background: 'white',
          border: '1px solid rgba(22,163,74,0.2)',
          borderRadius: 10,
          padding: '7px 12px',
          boxShadow: '0 4px 20px rgba(22,163,74,0.14)',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12,
          fontWeight: 600,
          color: '#16A34A',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
        All Systems Operational
      </motion.div>

      {/* Floating sync badge — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        transition={{ delay: 0.72, duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        {...(prefersReducedMotion ? {} : {
          animate: { y: [0, -5, 0], opacity: 1 },
          transition: { delay: 0.72, duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
        })}
        style={{
          position: 'absolute',
          bottom: 24,
          left: -8,
          background: 'white',
          border: '1px solid rgba(37,99,235,0.15)',
          borderRadius: 10,
          padding: '7px 12px',
          boxShadow: '0 4px 20px rgba(37,99,235,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12,
          fontWeight: 600,
          color: '#1D4ED8',
          whiteSpace: 'nowrap',
        }}
      >
        <span>99.99%</span>
        <span style={{ fontWeight: 400, color: '#64748B' }}>Response sync</span>
      </motion.div>
    </motion.div>
  );
}
