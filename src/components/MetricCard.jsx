import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ label, value, sub, badge, badgeType, icon: Icon, iconColor }) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{
        y: -3,
        boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="metric-label">
        {Icon && <Icon size={13} style={{ color: iconColor || 'var(--text-muted)' }} />}
        {label}
      </div>
      <motion.div
        className="metric-value"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
      >
        {value}
      </motion.div>
      {sub && <div className="metric-sub">{sub}</div>}
      {badge && (
        <motion.div
          className={`metric-badge ${badgeType || 'success'}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          {badge}
        </motion.div>
      )}
    </motion.div>
  );
}
