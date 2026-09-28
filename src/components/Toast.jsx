import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: <CheckCircle size={15} />,
  danger: <AlertTriangle size={15} />,
  warning: <AlertTriangle size={15} />,
  info: <Info size={15} />,
  check: <CheckCircle size={15} />,
  alert: <AlertTriangle size={15} />,
};

export default function Toast() {
  const { state, dismissToast } = useDemo();

  React.useEffect(() => {
    if (state.toasts.length === 0) return;
    const latest = state.toasts[state.toasts.length - 1];
    const timer = setTimeout(() => dismissToast(latest.id), 4500);
    return () => clearTimeout(timer);
  }, [state.toasts, dismissToast]);

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {state.toasts.map(toast => (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type}`}
            layout
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <span className={`toast-icon ${toast.type}`}>
              {icons[toast.icon] || icons[toast.type] || icons.info}
            </span>
            <span>{toast.message}</span>
            <motion.button
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
