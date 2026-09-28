import React, { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { CheckCircle, WifiOff, Wifi, AlertTriangle, ChevronLeft, ChevronRight, Bookmark, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    text: 'Which of the following correctly describes the Laplace transform of f(t) = e^(at)?',
    options: ['1/(s-a) for s > a', '1/(s+a) for s > -a', 'a/(s²+a²)', '1/s² for s > 0'],
    correct: 0,
  },
  {
    id: 2,
    text: 'The rank of a matrix is defined as the maximum number of:',
    options: ['Linearly independent row vectors', 'Columns in the matrix', 'Non-zero elements', 'Diagonal elements'],
    correct: 0,
  },
  {
    id: 3,
    text: 'Which numerical method requires bracketing the root before iteration?',
    options: ['Newton-Raphson', 'Bisection Method', 'Secant Method', 'Fixed Point Iteration'],
    correct: 1,
  },
  {
    id: 4,
    text: 'The Fourier series of a periodic function with period 2π includes:',
    options: ['Only sine terms', 'Only cosine terms', 'Both sine and cosine terms', 'Neither sine nor cosine terms'],
    correct: 2,
  },
  {
    id: 5,
    text: 'Which of the following is a solution to the differential equation dy/dx = y?',
    options: ['y = sin(x)', 'y = e^x', 'y = x²', 'y = ln(x)'],
    correct: 1,
  },
];

const TOTAL_Q = 50;

export default function CandidateView() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(84 * 60 + 32); // 1h 24m 32s
  const [saved, setSaved] = useState(false);

  const isOffline = state.networkStatus === 'critical';
  const isRecovering = state.networkStatus === 'recovering';

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function handleSelect(optIdx) {
    setSelected(prev => ({ ...prev, [currentQ]: optIdx }));
    setSaved(false);
    setTimeout(() => setSaved(true), 600);
  }

  function toggleMark() {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentQ)) next.delete(currentQ);
      else next.add(currentQ);
      return next;
    });
  }

  const q = questions[currentQ % questions.length];
  const answeredCount = Object.keys(selected).length;
  const timeWarning = timeLeft < 30 * 60;

  const syncStatus = isOffline ? 'offline' : isRecovering ? 'buffered' : 'synced';
  const syncLabel = isOffline ? 'Offline — Buffered' : isRecovering ? 'Syncing...' : 'Response Saved';
  const SyncIcon = isOffline ? WifiOff : isRecovering ? AlertTriangle : CheckCircle;

  return (
    <div className="exam-shell">
      {/* Topbar */}
      <div className="exam-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} style={{ color: 'var(--primary)' }} />
          <span className="exam-brand">Trust<span>Assess</span></span>
        </div>
        <div className="exam-name">RGPV Semester Assessment · Session 01 · Engineering Mathematics III</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className={`exam-sync ${syncStatus}`}>
            <SyncIcon size={13} />
            {syncLabel}
          </div>
          <div className={`exam-timer ${timeWarning ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Network alert banner */}
      {isOffline && (
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <div className="network-alert critical">
            <WifiOff size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div>
              <div className="network-alert-title">Connection Interrupted</div>
              <div className="network-alert-sub">
                Your answers are safe. Continuing in secure offline buffer mode — responses will sync automatically when connection is restored.
              </div>
            </div>
          </div>
        </div>
      )}
      {isRecovering && (
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <div className="network-alert">
            <AlertTriangle size={16} style={{ color: '#92400E', flexShrink: 0 }} />
            <div>
              <div className="network-alert-title">Reconnecting...</div>
              <div className="network-alert-sub">Connection is being restored. Your responses are buffered and will sync automatically.</div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="exam-main">
        {/* Question Panel */}
        <div className="question-panel">
          <div className="question-meta">
            <span className="question-number">Question {currentQ + 1} of {TOTAL_Q}</span>
            <span className="question-marks">Marks: +4 / -1</span>
          </div>
          <div className="question-text">{q.text}</div>
          <div className="options-list">
            {q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`option-item ${selected[currentQ] === idx ? 'selected' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <div className="option-circle" />
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
              </div>
            ))}
          </div>
          <div className="question-nav">
            <button className="btn btn-secondary" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              className={`btn btn-ghost ${marked.has(currentQ) ? 'btn-secondary' : ''}`}
              onClick={toggleMark}
              style={{ color: marked.has(currentQ) ? 'var(--warning)' : undefined }}
            >
              <Bookmark size={14} />
              {marked.has(currentQ) ? 'Marked' : 'Mark for Review'}
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentQ(q => Math.min(TOTAL_Q - 1, q + 1))}>
              Save & Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Question Grid Panel */}
        <div className="question-grid-panel">
          <div className="question-grid">
            <div className="q-grid-title">Questions</div>
            <div className="q-grid-numbers">
              {Array.from({ length: TOTAL_Q }, (_, i) => (
                <div
                  key={i}
                  className={`q-num ${i === currentQ ? 'current' : selected[i] !== undefined ? 'answered' : marked.has(i) ? 'marked' : ''}`}
                  onClick={() => setCurrentQ(i)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="card card-sm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { color: 'var(--primary)', label: 'Current' },
                { color: 'var(--success)', label: 'Answered' },
                { color: 'var(--warning)', label: 'Marked' },
                { color: 'var(--border)', label: 'Not visited' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: l.color, display: 'inline-block', flexShrink: 0 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card card-sm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Answered</span>
                <strong>{answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Remaining</span>
                <strong>{TOTAL_Q - answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Marked</span>
                <strong>{marked.size}</strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary w-full"
            style={{ justifyContent: 'center', fontSize: 12 }}
            onClick={() => navigate('/')}
          >
            ← Exit Candidate View
          </button>
        </div>
      </div>
    </div>
  );
}
