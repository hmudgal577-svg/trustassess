/**
 * TrustAssess — Centralized Framer Motion animation variants
 * All animation presets live here for consistency across the app.
 */

// ── Page Transitions ────────────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const pageTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
};

// ── Staggered Containers ────────────────────────────────────────────────────
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 24 },
  },
};

// ── Fade Variants ───────────────────────────────────────────────────────────
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: 'spring', stiffness: 300, damping: 26 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.92 },
  transition: { type: 'spring', stiffness: 360, damping: 28 },
};

export const slideRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring', stiffness: 340, damping: 32 },
};

// ── Floating Hero Animation ─────────────────────────────────────────────────
export const floatAnimation = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

// ── Subtle float for smaller elements ──────────────────────────────────────
export const floatSlow = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

export const floatDelayed = (delay = 1) => ({
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 7,
      delay,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
});

// ── Shield State Animations ─────────────────────────────────────────────────
export const shieldStates = {
  healthy: {
    filter: 'drop-shadow(0 0 12px rgba(22,163,74,0.35))',
    scale: 1,
    transition: { duration: 0.5 },
  },
  warning: {
    filter: 'drop-shadow(0 0 16px rgba(217,119,6,0.5))',
    scale: 1.02,
    transition: { duration: 0.4 },
  },
  critical: {
    filter: 'drop-shadow(0 0 20px rgba(220,38,38,0.6))',
    scale: 1.04,
    transition: { duration: 0.3 },
  },
  recovering: {
    filter: 'drop-shadow(0 0 14px rgba(37,99,235,0.5))',
    scale: 1,
    transition: { duration: 0.6 },
  },
};

// ── Pulse Variants ──────────────────────────────────────────────────────────
export const pulseGreen = {
  animate: {
    opacity: [1, 0.6, 1],
    scale: [1, 1.05, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pulseAmber = {
  animate: {
    opacity: [1, 0.55, 1],
    scale: [1, 1.06, 1],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pulseRed = {
  animate: {
    opacity: [1, 0.5, 1],
    scale: [1, 1.08, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ── Button micro-interactions ───────────────────────────────────────────────
export const buttonTap = { whileTap: { scale: 0.96 } };
export const buttonHover = { whileHover: { scale: 1.03 } };
export const buttonPrimary = {
  whileHover: { scale: 1.04, boxShadow: '0 4px 20px rgba(37,99,235,0.35)' },
  whileTap: { scale: 0.96 },
};

// ── Reduced Motion helper ───────────────────────────────────────────────────
// Usage: wrap in useReducedMotion() check
export const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
