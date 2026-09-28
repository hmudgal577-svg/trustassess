import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SidePanel from '../components/SidePanel';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, cardVariants } from '../components/PageWrapper';

export default function Centres() {
  const { state } = useDemo();
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="page-title">Examination Centres</h1>
        <p className="page-subtitle">Monitor infrastructure health across all 38 examination centres.</p>
      </motion.div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Centres', value: 38, color: 'var(--text-primary)' },
          { label: 'Healthy', value: 34, color: 'var(--success)' },
          { label: 'Warning', value: 2, color: 'var(--warning)' },
          { label: 'Recovering', value: 2, color: 'var(--recovering)' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="metric-card"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 + i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(15,23,42,0.10)' }}
          >
            <div className="metric-label">{s.label}</div>
            <div className="metric-value" style={{ color: s.color, fontSize: 24 }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Centre Cards — staggered grid */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {state.centres.map((centre, i) => (
          <motion.div
            key={centre.id}
            className="centre-card"
            variants={cardVariants}
            onClick={() => setSelected(centre)}
            whileHover={{
              y: -4,
              boxShadow: '0 8px 28px rgba(15,23,42,0.12)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="centre-card-header">
              <div>
                <div className="centre-name">{centre.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {centre.candidates.toLocaleString()} / {centre.totalCandidates.toLocaleString()} candidates
                </div>
              </div>
              <StatusBadge status={centre.status} />
            </div>
            <div className="health-bars">
              {[
                { label: 'Network', status: centre.network },
                { label: 'Server', status: centre.server },
                { label: 'Storage', status: centre.storage },
              ].map(({ label, status }) => (
                <div key={label} className="health-bar-row">
                  <span className="health-bar-label">{label}</span>
                  <div className="health-bar-track">
                    <motion.div
                      className={`health-bar-fill ${status}`}
                      initial={{ width: 0 }}
                      animate={{ width: status === 'healthy' ? '100%' : status === 'warning' ? '60%' : status === 'recovering' ? '45%' : '20%' }}
                      transition={{ delay: 0.3 + i * 0.04, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <StatusBadge status={status} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Latency: {centre.latency}ms</span>
              <span>{centre.rooms} rooms</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        style={{ marginTop: 16, padding: '12px 16px', background: 'var(--background)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Showing 7 primary centres. 31 additional centres are all reporting healthy status.
      </motion.div>

      <AnimatePresence>
        {selected && (
          <SidePanel key="centre-panel" title={`${selected.name} — Detailed View`} onClose={() => setSelected(null)}>
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{selected.name} Centre</div>
                <StatusBadge status={selected.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Active Candidates', value: selected.candidates.toLocaleString() },
                  { label: 'Total Enrolled', value: selected.totalCandidates.toLocaleString() },
                  { label: 'Network Latency', value: `${selected.latency} ms` },
                  { label: 'Exam Rooms', value: selected.rooms },
                ].map(({ label, value }, i) => (
                  <motion.div key={label}
                    style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.05 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                  </motion.div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Infrastructure Health</div>
                <div className="health-bars">
                  {[
                    { label: 'Network', status: selected.network },
                    { label: 'Server', status: selected.server },
                    { label: 'Storage', status: selected.storage },
                  ].map(({ label, status }, i) => (
                    <motion.div key={label} className="health-bar-row"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28 + i * 0.06 }}>
                      <span className="health-bar-label">{label}</span>
                      <div className="health-bar-track">
                        <motion.div
                          className={`health-bar-fill ${status}`}
                          initial={{ width: 0 }}
                          animate={{ width: status === 'healthy' ? '100%' : status === 'warning' ? '60%' : '35%' }}
                          transition={{ delay: 0.38 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <StatusBadge status={status} />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => navigate('/monitoring')}
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
                  whileTap={{ scale: 0.97 }}>
                  View Monitoring
                </motion.button>
                <motion.button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => navigate('/incidents')}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  View Incidents
                </motion.button>
              </div>
            </motion.div>
          </SidePanel>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
