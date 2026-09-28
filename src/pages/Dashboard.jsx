import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Server, Zap, AlertTriangle,
  CheckCircle, ArrowRight, MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MetricCard from '../components/MetricCard';
import MPMap from '../components/MPMap';
import ActivityChart from '../components/ActivityChart';
import StatusBadge from '../components/StatusBadge';
import Hero3D from '../components/Hero3D';
import TrustShield from '../components/TrustShield';
import { useDemo } from '../context/DemoContext';
import { activityFeed } from '../data/activity';
import { exam } from '../data/exams';
import SidePanel from '../components/SidePanel';
import { containerVariants, itemVariants } from '../components/PageWrapper';

const kpiDelay = [0, 0.07, 0.14, 0.21, 0.28];

export default function Dashboard({ onDemoMode }) {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [selectedCentre, setSelectedCentre] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const openIncidents = state.incidents.filter(
    i => i.status !== 'resolved' && i.status !== 'auto-recovered'
  );
  const recentIncidents = state.incidents.slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const shieldStatus =
    state.networkStatus === 'critical' ? 'critical' :
    state.networkStatus === 'recovering' ? 'recovering' :
    openIncidents.length > 2 ? 'warning' : 'healthy';

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <motion.div
        className="dashboard-hero"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        {/* Left: Welcome + exam info + shield */}
        <div className="hero-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <TrustShield status={shieldStatus} size={52} />
            <div>
              <div className="welcome-greeting">{greeting}, Admin</div>
              <div className="welcome-sub">Examination infrastructure is {shieldStatus === 'healthy' ? 'fully operational' : shieldStatus === 'warning' ? 'showing warnings' : 'under recovery'}</div>
            </div>
          </div>

          <motion.div
            className="exam-pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 320 }}
          >
            <div>
              <div className="exam-pill-name">{exam.name}</div>
              <div className="exam-pill-session">{exam.session} · {exam.subject}</div>
            </div>
          </motion.div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <motion.button
              className="btn btn-primary"
              style={{ gap: 6 }}
              onClick={onDemoMode}
              whileHover={!prefersReducedMotion ? { scale: 1.04, boxShadow: '0 4px 20px rgba(37,99,235,0.35)' } : {}}
              whileTap={{ scale: 0.96 }}
            >
              <Zap size={13} /> Simulate Incident
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={() => navigate('/candidate-view')}
              whileHover={!prefersReducedMotion ? { scale: 1.03 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              Candidate View
            </motion.button>
          </div>
        </div>

        {/* Right: 3D Hero */}
        <Hero3D className="hero-3d" />
      </motion.div>

      {/* ── KPI Cards — staggered ────────────────────────────────── */}
      <div className="metrics-grid">
        {[
          { label: 'Candidates Online', value: '11,842', sub: 'of 12,480 registered', badge: '94%', badgeType: 'success', icon: Users, iconColor: 'var(--primary)' },
          { label: 'Centres Active', value: '38 / 38', sub: 'All centres reporting', badge: '100%', badgeType: 'success', icon: Building2, iconColor: 'var(--success)' },
          { label: 'System Availability', value: '99.96%', sub: 'Last 30 minutes', badge: 'Excellent', badgeType: 'success', icon: Server, iconColor: 'var(--success)' },
          { label: 'Response Sync', value: '18 ms', sub: 'Average latency', badge: 'Normal', badgeType: 'info', icon: Zap, iconColor: 'var(--info)' },
          { label: 'Open Incidents', value: openIncidents.length.toString(), sub: 'Requires attention', badge: openIncidents.length > 0 ? `${openIncidents.length} active` : 'Clear', badgeType: openIncidents.length > 0 ? 'warning' : 'success', icon: AlertTriangle, iconColor: openIncidents.length > 0 ? 'var(--warning)' : 'var(--success)' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: kpiDelay[i], type: 'spring', stiffness: 300, damping: 24 }}
          >
            <MetricCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid: Chart + Map ───────────────────────────────── */}
      <div className="dashboard-grid">
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.32, type: 'spring', stiffness: 260, damping: 26 }}
          whileHover={!prefersReducedMotion ? { boxShadow: '0 6px 24px rgba(15,23,42,0.10)' } : {}}
        >
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="card-title-lg">Live Candidate Sessions</div>
            <motion.button className="btn-link" onClick={() => navigate('/live-assessment')}
              whileHover={!prefersReducedMotion ? { x: 3 } : {}}>
              View details <ArrowRight size={13} />
            </motion.button>
          </div>
          <ActivityChart height={200} />
        </motion.div>

        <motion.div
          className="card"
          style={{ padding: 16 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 260, damping: 26 }}
          whileHover={!prefersReducedMotion ? { boxShadow: '0 6px 24px rgba(15,23,42,0.10)' } : {}}
        >
          <div className="section-header" style={{ marginBottom: 8 }}>
            <div className="card-title-lg">Examination Centres</div>
            <motion.button className="btn-link" onClick={() => navigate('/centres')}
              whileHover={!prefersReducedMotion ? { x: 3 } : {}}>
              View all <ArrowRight size={13} />
            </motion.button>
          </div>
          <div style={{ height: 260 }}>
            <MPMap centres={state.centres} onCentreClick={c => setSelectedCentre(c)} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            {[
              { color: '#16A34A', label: 'Healthy' },
              { color: '#D97706', label: 'Warning' },
              { color: '#DC2626', label: 'Critical' },
              { color: '#7C3AED', label: 'Recovering' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                {l.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 260px', gap: 14 }}>
        {/* Incidents */}
        <motion.div className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="section-header">
            <div className="section-title">Recent Incidents</div>
            <motion.button className="btn-link" onClick={() => navigate('/incidents')}
              whileHover={!prefersReducedMotion ? { x: 3 } : {}}>
              View all <ArrowRight size={13} />
            </motion.button>
          </div>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {recentIncidents.map(incident => (
              <motion.div key={incident.id} className="incident-item" variants={itemVariants}
                onClick={() => navigate('/incidents')}
                whileHover={!prefersReducedMotion ? { x: 4 } : {}}>
                <div>
                  <div className="incident-id">{incident.id}</div>
                  <div className="incident-title">{incident.type}</div>
                  <div className="incident-centre">{incident.centre}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`severity-badge ${incident.severity}`}>{incident.severity}</span>
                  <StatusBadge status={incident.status} label={incident.statusLabel} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.50, type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Quick Actions</div>
          <div className="quick-actions">
            {[
              { label: 'Open Live Assessment', icon: MonitorPlay, cls: 'primary', to: '/live-assessment' },
              { label: 'View Incidents', icon: AlertTriangle, cls: 'warning', to: '/incidents' },
              { label: 'Run Recovery Test', icon: CheckCircle, cls: 'success', to: '/recovery' },
            ].map((action, i) => (
              <motion.button key={action.label} className="quick-action-btn"
                onClick={() => navigate(action.to)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.54 + i * 0.06 }}
                whileHover={!prefersReducedMotion ? { x: 4 } : {}} whileTap={{ scale: 0.97 }}>
                <div className={`quick-action-icon ${action.cls}`}>
                  <action.icon size={15} />
                </div>
                {action.label}
              </motion.button>
            ))}
          </div>
          <div className="divider" style={{ margin: '14px 0' }} />
          <motion.button className="btn btn-primary w-full" style={{ justifyContent: 'center', gap: 6 }}
            onClick={onDemoMode}
            whileHover={!prefersReducedMotion ? { scale: 1.03, boxShadow: '0 4px 20px rgba(37,99,235,0.35)' } : {}}
            whileTap={{ scale: 0.96 }}>
            <Zap size={13} /> Simulate Incident
          </motion.button>
        </motion.div>

        {/* Activity */}
        <motion.div className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
          </div>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {activityFeed.slice(0, 4).map(item => (
              <motion.div key={item.id} className="activity-item" variants={itemVariants}>
                <div className={`activity-icon ${item.type}`}><CheckCircle size={13} /></div>
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-sub">{item.sub}</div>
                </div>
                <div className="activity-time">{item.time}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Centre Detail Side Panel */}
      <AnimatePresence>
        {selectedCentre && (
          <SidePanel key="centre-panel" title={`${selectedCentre.name} Centre`} onClose={() => setSelectedCentre(null)}>
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{selectedCentre.name}</div>
                <StatusBadge status={selectedCentre.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Candidates', value: `${selectedCentre.candidates.toLocaleString()} / ${selectedCentre.totalCandidates.toLocaleString()}` },
                  { label: 'Latency', value: `${selectedCentre.latency} ms` },
                  { label: 'Rooms', value: selectedCentre.rooms },
                  { label: 'Exam', value: selectedCentre.examCode },
                ].map(({ label, value }, i) => (
                  <motion.div key={label}
                    style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.05 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                  </motion.div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Infrastructure Health</div>
                <div className="health-bars">
                  {[
                    { label: 'Network', status: selectedCentre.network },
                    { label: 'Server', status: selectedCentre.server },
                    { label: 'Storage', status: selectedCentre.storage },
                  ].map(({ label, status }, i) => (
                    <motion.div key={label} className="health-bar-row"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}>
                      <span className="health-bar-label">{label}</span>
                      <div className="health-bar-track">
                        <motion.div
                          className={`health-bar-fill ${status}`}
                          initial={{ width: 0 }}
                          animate={{ width: status === 'healthy' ? '100%' : status === 'warning' ? '65%' : '30%' }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <StatusBadge status={status} />
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.button className="btn btn-primary w-full" style={{ justifyContent: 'center' }}
                onClick={() => { setSelectedCentre(null); navigate('/centres'); }}
                whileHover={!prefersReducedMotion ? { scale: 1.03, boxShadow: '0 4px 16px rgba(37,99,235,0.3)' } : {}}
                whileTap={{ scale: 0.97 }}>
                View Full Centre Details
              </motion.button>
            </motion.div>
          </SidePanel>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
