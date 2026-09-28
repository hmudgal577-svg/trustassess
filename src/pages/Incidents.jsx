import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SidePanel from '../components/SidePanel';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants } from '../components/PageWrapper';

const FILTERS = ['all', 'critical', 'high', 'medium', 'low', 'resolved'];

export default function Incidents() {
  const { state, resolveIncident } = useDemo();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filtered = state.incidents.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'resolved') return i.status === 'resolved' || i.status === 'auto-recovered';
    return i.severity === filter;
  });

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
        <h1 className="page-title">Incident Center</h1>
        <p className="page-subtitle">Monitor, classify and resolve assessment disruptions.</p>
      </motion.div>

      {/* Filter chips — staggered */}
      <motion.div
        className="filter-bar"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {FILTERS.map(f => (
          <motion.button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="table-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, type: 'spring', stiffness: 260 }}
      >
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Type</th><th>Centre</th><th>Severity</th>
              <th>Affected</th><th>Detected</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((inc, i) => (
                <motion.tr
                  key={inc.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={() => setSelected(inc)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ backgroundColor: 'var(--background)' }}
                >
                  <td><span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{inc.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{inc.type}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inc.centre}</td>
                  <td><span className={`severity-badge ${inc.severity}`}>{inc.severity}</span></td>
                  <td>{inc.affectedCandidates} candidates</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'monospace' }}>{inc.detected}</td>
                  <td><StatusBadge status={inc.status} label={inc.statusLabel} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <motion.button
                        className="btn btn-secondary btn-sm"
                        onClick={e => { e.stopPropagation(); setSelected(inc); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Details
                      </motion.button>
                      {inc.status !== 'resolved' && inc.status !== 'auto-recovered' && (
                        <motion.button
                          className="btn btn-success btn-sm"
                          onClick={e => { e.stopPropagation(); resolveIncident(inc.id); }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Resolve
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No incidents found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Side Panel */}
      <AnimatePresence>
        {selected && (
          <SidePanel key="incident-panel" title="Incident Details" onClose={() => setSelected(null)}>
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
              >
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: 4 }}>{selected.id}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.type}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{selected.centre}</div>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Severity', value: <span className={`severity-badge ${selected.severity}`}>{selected.severity}</span> },
                  { label: 'Status', value: <StatusBadge status={selected.status} label={selected.statusLabel} /> },
                  { label: 'Affected', value: `${selected.affectedCandidates} candidates` },
                  { label: 'Detected', value: selected.detected },
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.04 }}
                  >
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
              >
                {selected.description}
              </motion.p>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Timeline</div>
                <div className="timeline">
                  {selected.timeline.map((ev, i) => (
                    <motion.div
                      key={i}
                      className="timeline-item"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.32 + i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
                    >
                      <div className="timeline-line">
                        <div className="timeline-dot" />
                        {i < selected.timeline.length - 1 && <div className="timeline-connector" />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                          <span className="timeline-time">{ev.time}</span>
                          <span className="timeline-event">{ev.event}</span>
                        </div>
                        <div className="timeline-detail">{ev.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {selected.status !== 'resolved' && selected.status !== 'auto-recovered' && (
                  <motion.button
                    className="btn btn-success"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => { resolveIncident(selected.id); setSelected(null); }}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Resolve Incident
                  </motion.button>
                )}
                <motion.button
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => navigate('/audit')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  View Audit Trail
                </motion.button>
              </div>
            </motion.div>
          </SidePanel>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
