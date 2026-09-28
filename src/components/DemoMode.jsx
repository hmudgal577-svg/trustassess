import React, { useState } from 'react';
import Modal from './Modal';
import { useDemo } from '../context/DemoContext';
import { Zap, CheckCircle, Loader, AlertTriangle, Shield } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import TrustShield from './TrustShield';
import ResponseFlow from './ResponseFlow';

const scenarios = [
  { id: 'network', label: 'Network Failure', desc: 'Simulate complete network loss at Bhopal Centre 07', icon: '📡' },
  { id: 'storage', label: 'Storage Failure', desc: 'Storage queue backup failure at a centre', icon: '💾' },
  { id: 'disconnect', label: 'Candidate Disconnect', desc: 'Mass candidate disconnection event', icon: '👥' },
  { id: 'outage', label: 'Centre Outage', desc: 'Complete centre offline scenario', icon: '🏢' },
  { id: 'suspicious', label: 'Suspicious Session', desc: 'Anomalous candidate behaviour detection', icon: '🔍' },
];

// Maps simulation step → shield status and phase label
function getSimPhase(step) {
  if (step === 0) return { shield: 'healthy', label: 'System Normal', color: '#16A34A' };
  if (step <= 2) return { shield: 'warning', label: 'Network Warning', color: '#D97706' };
  if (step <= 3) return { shield: 'critical', label: 'Incident Detected', color: '#DC2626' };
  if (step <= 5) return { shield: 'recovering', label: 'Recovery Active', color: '#2563EB' };
  if (step <= 6) return { shield: 'recovering', label: 'Reconciling...', color: '#7C3AED' };
  return { shield: 'verified', label: 'System Recovered', color: '#16A34A' };
}

export default function DemoMode({ onClose }) {
  const { state, startSimulation, resetSimulation } = useDemo();
  const prefersReducedMotion = useReducedMotion();
  const [selectedScenario, setSelectedScenario] = useState('network');
  const [simStarted, setSimStarted] = useState(false);

  function handleStart() {
    if (selectedScenario === 'network') {
      setSimStarted(true);
      startSimulation();
    } else {
      alert('In this prototype, only the Network Failure simulation is fully animated. Select it to see the full demo.');
    }
  }

  function handleReset() {
    setSimStarted(false);
    resetSimulation();
  }

  const steps = state.simulationSteps;
  const currentStep = state.simulationStep;
  const phase = getSimPhase(simStarted ? currentStep : 0);
  const isFlowActive = simStarted && currentStep >= 3 && currentStep <= 7;
  const isFailoverActive = simStarted && currentStep >= 5;
  const recon = state.reconciliation;

  return (
    <Modal
      title="Demo Mode — Simulate Incident"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          {simStarted ? (
            <motion.button className="btn btn-secondary" onClick={handleReset}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              Reset
            </motion.button>
          ) : (
            <>
              <motion.button className="btn btn-secondary" onClick={onClose}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                Cancel
              </motion.button>
              <motion.button className="btn btn-primary" onClick={handleStart}
                whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}
                whileTap={{ scale: 0.96 }}>
                <Zap size={14} /> Start Simulation
              </motion.button>
            </>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Meta info */}
        <motion.div
          style={{ background: 'var(--background)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Centre</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Bhopal Centre 07</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Affected</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>27 candidates</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Severity</div>
              <span className="severity-badge medium">Medium</span>
            </div>
          </div>
        </motion.div>

        {/* Main simulation area */}
        <AnimatePresence mode="wait">
          {!simStarted ? (
            /* Scenario selector */
            <motion.div key="selector"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Select Scenario</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {scenarios.map((s, i) => (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedScenario(s.id)}
                    whileHover={{ x: 3 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${selectedScenario === s.id ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedScenario === s.id ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selectedScenario === s.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Active simulation */
            <motion.div key="simulation"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {/* Two-column: Shield + Flow | Steps */}
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, marginBottom: 16 }}>
                {/* Left: Shield + Phase + ResponseFlow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <TrustShield status={phase.shield} size={72} showLabel />

                  {/* Phase label */}
                  <motion.div
                    key={phase.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: phase.color,
                      textAlign: 'center',
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: `${phase.color}18`,
                      border: `1px solid ${phase.color}30`,
                    }}
                  >
                    {phase.label}
                  </motion.div>

                  {/* Response flow dots */}
                  <ResponseFlow active={isFlowActive} failoverActive={isFailoverActive} compact />
                </div>

                {/* Right: Step progress */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Simulation Progress
                  </div>
                  <div className="simulation-steps">
                    {steps.map((s, i) => {
                      const isDone = currentStep > s.step;
                      const isActive = currentStep === s.step;
                      return (
                        <motion.div
                          key={s.step}
                          className={`sim-step ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
                        >
                          <motion.div
                            className="sim-step-num"
                            animate={isActive && !prefersReducedMotion ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                            transition={isActive ? { repeat: Infinity, duration: 1.2 } : {}}
                          >
                            {isDone ? <CheckCircle size={12} /> : isActive ? <Loader size={12} className="spinning" /> : s.step}
                          </motion.div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                            <div style={{ fontSize: 10, opacity: 0.65 }}>{s.detail}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reconciliation stats — appears at step 6+ */}
              <AnimatePresence>
                {recon && currentStep >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{
                      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
                      padding: '12px', background: 'var(--background)', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', marginBottom: 10,
                    }}
                  >
                    {[
                      { label: 'Buffered', value: recon.buffered },
                      { label: 'Received', value: recon.received },
                      { label: 'Validated', value: recon.validated },
                      { label: 'Lost', value: recon.lost, good: recon.lost === 0 },
                      { label: 'Duplicates', value: recon.duplicates, good: recon.duplicates === 0 },
                    ].map((item, i) => (
                      <motion.div key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07, type: 'spring' }}
                        style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: 18, fontWeight: 700,
                          color: item.good !== undefined ? (item.good ? 'var(--success)' : 'var(--danger)') : 'var(--primary)',
                        }}>
                          {item.value}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final success */}
              <AnimatePresence>
                {currentStep >= 8 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{
                      padding: '12px 14px', background: 'var(--success-light)',
                      borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0',
                      display: 'flex', alignItems: 'center', gap: 10,
                      color: 'var(--success)', fontWeight: 600, fontSize: 13,
                    }}
                  >
                    <CheckCircle size={16} />
                    <div>
                      <div>System Recovered — All responses verified</div>
                      <div style={{ fontWeight: 400, fontSize: 11, opacity: 0.8, marginTop: 1 }}>
                        0 responses lost · 27 buffered, 27 validated · Audit chain intact
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertTriangle size={11} />
          Prototype simulation using synthetic data. No real exam data is affected.
        </div>
      </div>
    </Modal>
  );
}
