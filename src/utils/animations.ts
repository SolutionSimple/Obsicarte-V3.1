import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, y: 20 },
};

export const fadeInSlow: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0 },
};

export const fadeInUpSlow: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, y: 30 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, x: 20 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, x: -20 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const buttonHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const iconSpin: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const iconBounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

export const shimmerEffect = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

export const glowPulse: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.6, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const rotateIn: Variants = {
  initial: { opacity: 0, rotate: -10, scale: 0.9 },
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, rotate: 10, scale: 0.9 },
};

export const flipIn: Variants = {
  initial: { opacity: 0, rotateY: -90 },
  animate: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, rotateY: 90 },
};

export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
    },
  },
};

export const counterAnimation = (from: number, to: number, duration: number = 1) => ({
  initial: from,
  animate: to,
  transition: {
    duration,
    ease: 'easeOut',
  },
});

export const rippleEffect = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const checkmarkDraw: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};
