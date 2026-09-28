import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { centres as initialCentres } from '../data/centres';
import { incidents as initialIncidents } from '../data/incidents';
import { auditEvents as initialAuditEvents } from '../data/exams';

const DemoContext = createContext(null);

const SIMULATION_STEPS = [
  { step: 1, label: 'Network dropping...', detail: 'Bhopal Centre 07 network critical' },
  { step: 2, label: 'Incident created', detail: 'INC-1050 logged automatically' },
  { step: 3, label: 'Buffer activated', detail: 'Local response buffer engaged' },
  { step: 4, label: 'Candidates notified', detail: '27 candidates in offline mode' },
  { step: 5, label: 'Responses buffered', detail: '27 responses secured locally' },
  { step: 6, label: 'Connection restored', detail: 'Network recovered' },
  { step: 7, label: 'Reconciliation', detail: '27 buffered · 27 received · 0 lost' },
  { step: 8, label: 'Recovery completed', detail: 'RECOVERY_COMPLETED audit event logged' },
];

const initialState = {
  centres: initialCentres,
  incidents: initialIncidents,
  auditEvents: initialAuditEvents,
  systemStatus: 'operational',
  simulationActive: false,
  simulationStep: 0,
  simulationSteps: SIMULATION_STEPS,
  simulationCentre: 'Bhopal Centre 07',
  simulationCandidates: 27,
  demoMode: true,
  reconciliation: null,
  toasts: [],
  networkStatus: 'healthy',
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_SIMULATION':
      return { ...state, simulationActive: true, simulationStep: 1, reconciliation: null };

    case 'ADVANCE_STEP': {
      const step = action.step;
      let newState = { ...state, simulationStep: step };

      if (step === 1) {
        // network drops
        newState.centres = state.centres.map(c =>
          c.id === 'c-bhopal' ? { ...c, status: 'critical', network: 'critical', latency: 999 } : c
        );
        newState.networkStatus = 'critical';
        newState.systemStatus = 'degraded';
      }
      if (step === 2) {
        // incident created
        const newIncident = {
          id: 'INC-1050',
          type: 'Network Failure',
          typeCode: 'network',
          centre: 'Bhopal Centre 07',
          centreId: 'c-bhopal',
          severity: 'medium',
          affectedCandidates: 27,
          detected: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          status: 'active',
          statusLabel: 'Active',
          description: 'Simulated network failure at Bhopal Centre 07. Buffer activated.',
          timeline: [
            { time: new Date().toLocaleTimeString(), event: 'INCIDENT_DETECTED', detail: 'Complete network loss' },
          ],
        };
        newState.incidents = [newIncident, ...state.incidents];
      }
      if (step === 5) {
        // buffer stats
        newState.reconciliation = { buffered: 27, received: 0, validated: 0, lost: 0, duplicates: 0 };
      }
      if (step === 6) {
        // network restored
        newState.centres = state.centres.map(c =>
          c.id === 'c-bhopal' ? { ...c, status: 'recovering', network: 'recovering', latency: 28 } : c
        );
        newState.networkStatus = 'recovering';
      }
      if (step === 7) {
        // reconciliation
        newState.reconciliation = { buffered: 27, received: 27, validated: 27, lost: 0, duplicates: 0 };
      }
      if (step === 8) {
        // fully recovered
        newState.centres = state.centres.map(c =>
          c.id === 'c-bhopal' ? { ...c, status: 'healthy', network: 'healthy', latency: 16 } : c
        );
        newState.networkStatus = 'healthy';
        newState.systemStatus = 'operational';
        newState.incidents = state.incidents.map(i =>
          i.id === 'INC-1050' ? { ...i, status: 'auto-recovered', statusLabel: 'Auto Recovered' } : i
        );
        const newAuditEvent = {
          id: `AUD-SIM-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          event: 'RECOVERY_COMPLETED',
          actor: 'System',
          detail: 'INC-1050 — 27 responses reconciled, 0 lost, integrity verified',
          hash: Math.random().toString(16).slice(2, 18),
          prevHash: 'b7d5e2a8f4c19630',
        };
        newState.auditEvents = [...state.auditEvents, newAuditEvent];
        newState.simulationActive = false;
      }

      return newState;
    }

    case 'RESET_SIMULATION':
      return {
        ...state,
        simulationActive: false,
        simulationStep: 0,
        centres: initialCentres,
        networkStatus: 'healthy',
        systemStatus: 'operational',
        reconciliation: null,
        incidents: initialIncidents,
        auditEvents: initialAuditEvents,
      };

    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.toast }],
      };

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };

    case 'UPDATE_CENTRE_STATUS':
      return {
        ...state,
        centres: state.centres.map(c =>
          c.id === action.centreId ? { ...c, ...action.updates } : c
        ),
      };

    case 'ADD_AUDIT_EVENT':
      return { ...state, auditEvents: [...state.auditEvents, action.event] };

    case 'RESOLVE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.id === action.id ? { ...i, status: 'resolved', statusLabel: 'Resolved' } : i
        ),
      };

    default:
      return state;
  }
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);

  const addToast = useCallback((toast) => {
    dispatch({ type: 'ADD_TOAST', toast });
  }, []);

  const dismissToast = useCallback((id) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  const startSimulation = useCallback(() => {
    dispatch({ type: 'START_SIMULATION' });
    addToast({ type: 'info', message: 'Network failure simulation started', icon: 'alert' });

    let step = 1;
    const toastMessages = {
      1: { type: 'danger', message: 'Network critical — Bhopal Centre 07', icon: 'alert' },
      2: { type: 'warning', message: 'INC-1050 created automatically', icon: 'alert' },
      3: { type: 'info', message: 'Local response buffer activated', icon: 'info' },
      5: { type: 'info', message: '27 responses buffered locally', icon: 'check' },
      6: { type: 'success', message: 'Connection restored', icon: 'check' },
      7: { type: 'success', message: 'Reconciliation: 27/27 validated, 0 lost', icon: 'check' },
      8: { type: 'success', message: 'Recovery completed — AUDIT EVENT logged', icon: 'check' },
    };

    const advance = () => {
      if (step > 8) return;
      dispatch({ type: 'ADVANCE_STEP', step });
      if (toastMessages[step]) addToast(toastMessages[step]);
      step++;
      if (step <= 8) {
        timerRef.current = setTimeout(advance, 1800);
      }
    };

    timerRef.current = setTimeout(advance, 800);
  }, [addToast]);

  const resetSimulation = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch({ type: 'RESET_SIMULATION' });
    addToast({ type: 'info', message: 'Simulation reset', icon: 'info' });
  }, [addToast]);

  const resolveIncident = useCallback((id) => {
    dispatch({ type: 'RESOLVE_INCIDENT', id });
    addToast({ type: 'success', message: `${id} marked as resolved`, icon: 'check' });
  }, [addToast]);

  return (
    <DemoContext.Provider value={{ state, dispatch, addToast, dismissToast, startSimulation, resetSimulation, resolveIncident }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
