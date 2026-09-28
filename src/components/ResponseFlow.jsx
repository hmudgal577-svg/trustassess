import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ResponseFlow — Animated data flow visualization.
 * Shows dots travelling from Candidate → Buffer → Server → Storage.
 * Subtle, non-distracting. Active only during simulation.
 */

const NODES = [
  { id: 'candidate', label: 'Candidate', icon: '👤' },
  { id: 'buffer', label: 'Local Buffer', icon: '💾' },
  { id: 'server', label: 'Primary Server', icon: '🖥️' },
  { id: 'storage', label: 'Verified Storage', icon: '🔒' },
];

const DOT_COUNT = 3;

function FlowDot({ delay, active, color = '#2563EB' }) {
  const prefersReducedMotion = useReducedMotion();
  if (!active || prefersReducedMotion) return null;
  return (
    <motion.div
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: color,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        boxShadow: `0 0 6px ${color}`,
      }}
      initial={{ top: '10%', opacity: 0 }}
      animate={{
        top: ['10%', '85%'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 0.4,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function ResponseFlow({ active = false, failoverActive = false, compact = false }) {
  const prefersReducedMotion = useReducedMotion();
  const dotColor = failoverActive ? '#7C3AED' : '#2563EB';

  const size = compact ? { node: 44, gap: 50 } : { node: 56, gap: 64 };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      userSelect: 'none',
    }}>
      {NODES.map((node, idx) => (
        <React.Fragment key={node.id}>
          {/* Node */}
          <motion.div
            style={{
              width: size.node,
              height: size.node,
              borderRadius: 12,
              background: 'var(--surface)',
              border: `1.5px solid ${active && idx < 3 ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              boxShadow: active && idx < 3 ? '0 0 12px rgba(37,99,235,0.18)' : 'none',
              transition: 'box-shadow 0.4s, border-color 0.4s',
              zIndex: 1,
            }}
            animate={active && !prefersReducedMotion ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 2.5, repeat: active ? Infinity : 0, delay: idx * 0.3 }}
          >
            <span style={{ fontSize: compact ? 16 : 20 }}>{node.icon}</span>
            {!compact && (
              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                {node.label}
              </span>
            )}
          </motion.div>

          {/* Connector with animated dots */}
          {idx < NODES.length - 1 && (
            <div style={{
              position: 'relative',
              width: 2,
              height: size.gap,
              background: active ? 'var(--primary)' : 'var(--border)',
              opacity: active ? 0.5 : 0.3,
              transition: 'background 0.4s',
            }}>
              {Array.from({ length: DOT_COUNT }).map((_, i) => (
                <FlowDot
                  key={i}
                  active={active}
                  delay={i * 0.5 + idx * 0.2}
                  color={dotColor}
                />
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
