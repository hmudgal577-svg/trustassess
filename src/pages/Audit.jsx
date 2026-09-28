import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { CheckCircle, Shield, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Audit() {
  const { state, addToast } = useDemo();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  function verifyChain() {
    setVerifying(true);
    addToast({ type: 'info', message: 'Verifying audit chain integrity...', icon: 'info' });
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      addToast({ type: 'success', message: 'All audit events verified — chain intact', icon: 'check' });
    }, 2200);
  }

  const events = state.auditEvents;
  const totalEvents = events.length;
  const verifiedEvents = verified ? totalEvents : totalEvents - 2;

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
        <h1 className="page-title">Audit & Evidence</h1>
        <p className="page-subtitle">
          Tamper-evident event chain for exam integrity verification.{' '}
          <span style={{ fontSize: 11, background: 'var(--warning-light)', color: 'var(--warning)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
            Prototype Audit Simulation
          </span>
        </p>
      </motion.div>

      {/* 3D Audit Hero Banner */}
      <motion.div
        className="card"
        style={{
          marginBottom: 20,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(255,255,255,0.9) 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '20px 24px',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.04 }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Cryptographic Tamper-Proof Audit Trail
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
            Every state change, response sync, and recovery event is recorded as an immutable hash block in sequential chain order. Zero lost records. Zero silent modifications.
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 500 }}>
              <CheckCircle size={14} /> SHA-256 Hash Chaining Active
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 500 }}>
              <Shield size={14} /> Cryptographic Proof Validated
            </span>
          </div>
        </div>
        <motion.div
          style={{ width: 120, height: 120, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/assets/3d/audit-evidence.png"
            alt="Audit Evidence 3D"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.12))' }}
          />
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Events', value: totalEvents },
          { label: 'Verified Events', value: verified ? totalEvents : verifiedEvents },
          { label: 'Integrity Status', value: verified ? 'Valid' : 'Pending', color: verified ? 'var(--success)' : 'var(--warning)' },
          { label: 'Last Verification', value: verified ? 'Just now' : 'Not verified' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="metric-card"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 + i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ y: -3 }}
          >
            <div className="metric-label">{s.label}</div>
            <motion.div
              className="metric-value"
              style={{ fontSize: 22, color: s.color }}
              key={s.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {s.value}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Event Chain</div>
        <motion.button
          className={`btn ${verified ? 'btn-success' : 'btn-primary'}`}
          onClick={verifyChain}
          disabled={verifying}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
          whileTap={{ scale: 0.96 }}
        >
          {verifying ? <Loader size={14} className="spinning" /> : <Shield size={14} />}
          {verified ? 'Chain Verified' : verifying ? 'Verifying...' : 'Verify Integrity'}
        </motion.button>
      </div>

      <div>
        <AnimatePresence>
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="audit-chain-item"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ x: 3, boxShadow: '0 2px 10px rgba(15,23,42,0.08)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{ev.time}</span>
                    <span className="audit-event-name">{ev.event}</span>
                    <AnimatePresence>
                      {verified && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 18 }}
                        >
                          <CheckCircle size={12} style={{ color: 'var(--success)' }} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{ev.detail}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Actor</span>
                      <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 500 }}>{ev.actor}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Event Hash</span>
                      <span className="audit-hash">{ev.hash}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Previous Hash</span>
                      <span className="audit-hash">{ev.prevHash}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>#{i + 1}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
