import React, { useState } from 'react';
import { motion } from 'framer-motion';

const settingsGroups = [
  {
    label: 'General',
    items: [
      { id: 'timezone', label: 'Timezone', desc: 'IST (UTC+5:30)', type: 'text', value: 'IST (UTC+5:30)' },
      { id: 'notifications', label: 'Email Notifications', desc: 'Send alerts to admin email', type: 'toggle', value: true },
      { id: 'autosave', label: 'Auto-save Responses', desc: 'Save candidate responses every 30 seconds', type: 'toggle', value: true },
    ],
  },
  {
    label: 'Examination',
    items: [
      { id: 'session', label: 'Active Session', desc: 'RGPV Semester Assessment — Session 01', type: 'text', value: 'RGPV-SEM-01' },
      { id: 'duration', label: 'Session Duration', desc: '180 minutes per session', type: 'text', value: '180 min' },
      { id: 'bufferq', label: 'Question Buffer', desc: 'Pre-load next 5 questions', type: 'toggle', value: true },
    ],
  },
  {
    label: 'Recovery Policies',
    items: [
      { id: 'autofail', label: 'Auto Failover', desc: 'Automatically activate secondary server on failure', type: 'toggle', value: true },
      { id: 'offline', label: 'Offline Buffer Mode', desc: 'Allow candidates to continue offline for up to 10 minutes', type: 'toggle', value: true },
      { id: 'recon', label: 'Auto Reconciliation', desc: 'Automatically reconcile responses on reconnect', type: 'toggle', value: true },
      { id: 'rto', label: 'Recovery Time Objective', desc: 'Target: < 3 minutes', type: 'text', value: '3 min' },
    ],
  },
  {
    label: 'Notifications',
    items: [
      { id: 'incalert', label: 'Incident Alerts', desc: 'Notify admin on new incidents', type: 'toggle', value: true },
      { id: 'recovery_notif', label: 'Recovery Notifications', desc: 'Notify when recovery completes', type: 'toggle', value: true },
      { id: 'latency_warn', label: 'Latency Warnings', desc: 'Alert when latency > 100ms', type: 'toggle', value: true },
    ],
  },
  {
    label: 'Security',
    items: [
      { id: 'audit_log', label: 'Audit Logging', desc: 'Log all system events to tamper-evident chain', type: 'toggle', value: true },
      { id: 'hash_verify', label: 'Response Hash Verification', desc: 'Verify response integrity on sync', type: 'toggle', value: true },
      { id: 'session_monitor', label: 'Session Anomaly Detection', desc: 'Flag unusual candidate behaviour', type: 'toggle', value: true },
    ],
  },
  {
    label: 'Demo Mode',
    items: [
      { id: 'demo_on', label: 'Demo Mode Active', desc: 'Synthetic data — no real exam data', type: 'toggle', value: true },
      { id: 'sim_speed', label: 'Simulation Speed', desc: 'Normal speed (1.8s per step)', type: 'text', value: 'Normal' },
    ],
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState(() => {
    const init = {};
    settingsGroups.forEach(g => g.items.forEach(i => {
      if (i.type === 'toggle') init[i.id] = i.value;
    }));
    return init;
  });

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <motion.div className="page-header" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure examination, recovery, and system preferences.</p>
      </motion.div>

      <div style={{ maxWidth: 680 }}>
        {settingsGroups.map(group => (
          <div key={group.label} className="settings-group">
            <div className="settings-group-title">{group.label}</div>
            {group.items.map(item => (
              <div key={item.id} className="setting-row">
                <div>
                  <div className="setting-label">{item.label}</div>
                  <div className="setting-desc">{item.desc}</div>
                </div>
                {item.type === 'toggle' ? (
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={toggles[item.id] ?? item.value}
                      onChange={e => setToggles(t => ({ ...t, [item.id]: e.target.checked }))}
                    />
                    <span className="toggle-slider" />
                  </label>
                ) : (
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    background: 'var(--background)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
