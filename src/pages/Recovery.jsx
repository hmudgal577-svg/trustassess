import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import {
  Server, Database, HardDrive, RefreshCw, CheckCircle, Loader
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import ResponseFlow from '../components/ResponseFlow';
import TrustShield from '../components/TrustShield';

const archNodes = [
  { id: 'primary', label: 'Primary Server', sub: 'Bhopal DC-1', icon: Server },
  { id: 'buffer', label: 'Response Buffer', sub: 'In-memory queue', icon: Database },
  { id: 'secondary', label: 'Secondary Server', sub: 'Indore DC-2', icon: Server },
  { id: 'backup', label: 'Backup Storage', sub: 'Encrypted cold store', icon: HardDrive },
];

export default function Recovery() {
  const { state, addToast } = useDemo();
  const prefersReducedMotion = useReducedMotion();
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [failoverActive, setFailoverActive] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const flowActive = failoverActive || testResult === 'passed';

  function runRecoveryTest() {
    setTestRunning(true); setTestResult(null);
    addToast({ type: 'info', message: 'Recovery test initiated...', icon: 'info' });
    setTimeout(() => { setTestRunning(false); setTestResult('passed'); addToast({ type: 'success', message: 'Recovery test passed — all nodes healthy', icon: 'check' }); }, 2500);
  }
  function activateFailover() { setFailoverActive(true); addToast({ type: 'warning', message: 'Failover activated — traffic routed to secondary', icon: 'alert' }); }
  function reconcileResponses() {
    setReconciling(true); addToast({ type: 'info', message: 'Reconciling buffered responses...', icon: 'info' });
    setTimeout(() => { setReconciling(false); addToast({ type: 'success', message: 'Reconciliation complete — 0 responses lost', icon: 'check' }); }, 2000);
  }
  function verifyIntegrity() {
    setVerifying(true); addToast({ type: 'info', message: 'Verifying response integrity...', icon: 'info' });
    setTimeout(() => { setVerifying(false); setVerified(true); addToast({ type: 'success', message: 'Integrity verified — all hashes valid', icon: 'check' }); }, 2000);
  }

  const recon = state.reconciliation;
  const shieldStatus = verified ? 'verified' : failoverActive ? 'recovering' : testRunning ? 'warning' : 'healthy';

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <motion.div className="page-header" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="page-title">Recovery Console</h1>
        <p className="page-subtitle">Monitor failover architecture and manage response reconciliation.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        {/* Left: Architecture + 3D visual + shield */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 3D Recovery Image */}
          <motion.div
            className="card"
            style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 26 }}
          >
            <motion.img
              src="/assets/3d/recovery-system.jpg"
              alt="Recovery infrastructure visualization"
              style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
              animate={!prefersReducedMotion && flowActive ? { opacity: [0.9, 1, 0.9] } : { opacity: 1 }}
              transition={{ duration: 3, repeat: flowActive ? Infinity : 0, ease: 'easeInOut' }}
            />
            <div style={{
              position: 'absolute', top: 10, right: 10,
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 8, padding: '6px 10px',
              boxShadow: '0 2px 12px rgba(15,23,42,0.12)',
            }}>
              <TrustShield status={shieldStatus} size={28} />
              <span style={{ fontSize: 11, fontWeight: 600, color: shieldStatus === 'verified' ? '#16A34A' : shieldStatus === 'recovering' ? '#2563EB' : '#16A34A' }}>
                {shieldStatus === 'verified' ? 'Verified' : shieldStatus === 'recovering' ? 'Failover Active' : 'Secure'}
              </span>
            </div>
          </motion.div>

          {/* Architecture Diagram */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="card-title-lg" style={{ marginBottom: 16 }}>System Architecture</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {/* Arch diagram */}
              <div className="recovery-arch" style={{ flex: 1 }}>
                {archNodes.map((node, idx) => {
                  const NodeIcon = node.icon;
                  const isActive = node.id === 'secondary' && failoverActive;
                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        className={`arch-node ${isActive ? 'primary-node' : ''}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 + idx * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                        whileHover={!prefersReducedMotion ? { x: 4 } : {}}
                      >
                        <motion.div
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: isActive ? 'var(--primary)' : 'var(--background)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}
                          animate={isActive && !prefersReducedMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                          transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                        >
                          <NodeIcon size={16} color={isActive ? 'white' : 'var(--text-secondary)'} />
                        </motion.div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{node.label}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{node.sub}</div>
                        </div>
                      </motion.div>
                      {idx < archNodes.length - 1 && (
                        <motion.div className="arch-connector"
                          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                          transition={{ delay: 0.30 + idx * 0.08 }}>
                          <div className="arch-arrow" />
                        </motion.div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Live ResponseFlow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Data Flow</div>
                <ResponseFlow active={flowActive} failoverActive={failoverActive} compact />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div className="card"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, type: 'spring', stiffness: 260, damping: 26 }}>
            <div className="card-title-lg" style={{ marginBottom: 14 }}>Recovery Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: testRunning ? 'Testing...' : testResult === 'passed' ? '✓ Test Passed' : 'Run Recovery Test', icon: testRunning ? Loader : RefreshCw, onClick: runRecoveryTest, disabled: testRunning, cls: testResult === 'passed' ? 'btn-success' : 'btn-secondary' },
                { label: failoverActive ? 'Failover Active' : 'Activate Failover', icon: Server, onClick: activateFailover, cls: failoverActive ? 'btn-success' : 'btn-secondary' },
                { label: reconciling ? 'Reconciling...' : 'Reconcile Responses', icon: reconciling ? Loader : Database, onClick: reconcileResponses, disabled: reconciling, cls: 'btn-secondary' },
                { label: verifying ? 'Verifying...' : verified ? '✓ Integrity Verified' : 'Verify Integrity', icon: verifying ? Loader : CheckCircle, onClick: verifyIntegrity, disabled: verifying, cls: verified ? 'btn-success' : 'btn-secondary' },
              ].map((btn, i) => (
                <motion.button key={btn.label} className={`btn ${btn.cls}`}
                  style={{ justifyContent: 'center', gap: 6, padding: '12px' }}
                  onClick={btn.onClick} disabled={btn.disabled}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.06 }}
                  whileHover={!prefersReducedMotion ? { scale: 1.04, boxShadow: '0 4px 14px rgba(15,23,42,0.12)' } : {}}
                  whileTap={{ scale: 0.96 }}>
                  <btn.icon size={14} className={btn.disabled ? 'spinning' : ''} />
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {recon && (
              <motion.div className="card"
                initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                <div className="card-title-lg" style={{ marginBottom: 14 }}>Response Reconciliation</div>
                <div className="reconciliation-grid">
                  {[
                    { label: 'Buffered', value: recon.buffered, type: '' },
                    { label: 'Received', value: recon.received, type: recon.received === recon.buffered ? 'success' : '' },
                    { label: 'Validated', value: recon.validated, type: recon.validated === recon.buffered ? 'success' : '' },
                    { label: 'Lost', value: recon.lost, type: recon.lost === 0 ? 'success' : 'danger' },
                    { label: 'Duplicates', value: recon.duplicates, type: recon.duplicates === 0 ? 'success' : 'danger' },
                  ].map((item, i) => (
                    <motion.div key={item.label} className="recon-item"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 320, damping: 22 }}>
                      <motion.div className={`recon-value ${item.type}`}
                        key={item.value} initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                        {item.value}
                      </motion.div>
                      <div className="recon-label">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className="card"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, type: 'spring', stiffness: 260 }}>
            <div className="card-title-lg" style={{ marginBottom: 14 }}>Node Status</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Node</th><th>Status</th><th>Monitoring</th><th>Last Sync</th></tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Primary Server (Bhopal DC-1)', status: 'healthy', mon: 'Active', sync: '0.4s ago' },
                    { name: 'Response Buffer', status: 'healthy', mon: 'Active', sync: '0.1s ago' },
                    { name: 'Secondary Server (Indore DC-2)', status: failoverActive ? 'active' : 'healthy', mon: failoverActive ? 'Active' : 'Standby', sync: '2s ago' },
                    { name: 'Backup Storage', status: 'healthy', mon: 'Active', sync: '30s ago' },
                  ].map((n, i) => (
                    <motion.tr key={n.name}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.42 + i * 0.05 }}>
                      <td style={{ fontWeight: 500 }}>{n.name}</td>
                      <td><span className={`status-badge ${n.status}`}>{n.status === 'active' ? 'Active' : 'Healthy'}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{n.mon}</td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 12 }}>{n.sync}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
