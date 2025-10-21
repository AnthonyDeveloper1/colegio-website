/**
 * Animation Utilities
 * Helpers y variants reutilizables para animaciones Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Fade In Variants
 */
export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none',
  distance: number = 20,
  delay: number = 0,
  duration: number = 0.5
): Variants => {
  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  };
};

/**
 * Scale In Variants
 */
export const scaleIn = (
  delay: number = 0,
  duration: number = 0.4,
  scale: number = 0.8
): Variants => ({
  hidden: {
    opacity: 0,
    scale,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: 'easeOut',
    },
  },
});

/**
 * Slide In Variants
 */
export const slideIn = (
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance: number = 100,
  delay: number = 0,
  duration: number = 0.6
): Variants => {
  const directionOffset = {
    left: { x: -distance },
    right: { x: distance },
    top: { y: -distance },
    bottom: { y: distance },
  };

  return {
    hidden: {
      ...directionOffset[direction],
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  };
};

/**
 * Stagger Container
 */
export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Stagger Item
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Hover Scale
 */
export const hoverScale = (scale: number = 1.05): { whileHover: any; whileTap: any } => ({
  whileHover: { scale, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95, transition: { duration: 0.1 } },
});

/**
 * Hover Lift
 */
export const hoverLift = (y: number = -8): { whileHover: any } => ({
  whileHover: {
    y,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2 },
  },
});

/**
 * Rotate Animation
 */
export const rotate = (
  degrees: number = 360,
  duration: number = 1,
  repeat: number = Infinity
): { animate: any } => ({
  animate: {
    rotate: degrees,
    transition: {
      duration,
      repeat,
      ease: 'linear',
    },
  },
});

/**
 * Pulse Animation
 */
export const pulse = (scale: number = 1.05, duration: number = 1): { animate: any } => ({
  animate: {
    scale: [1, scale, 1],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

/**
 * Shake Animation (para errores)
 */
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Bounce Animation
 */
export const bounce: Variants = {
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Viewport Config (para whileInView)
 */
export const viewportConfig = {
  once: true,
  amount: 0.3, // 30% visible para trigger
  margin: '0px 0px -100px 0px', // Trigger 100px antes
};

/**
 * Smooth Transition Presets
 */
export const transitions = {
  smooth: { duration: 0.3, ease: 'easeInOut' },
  fast: { duration: 0.15, ease: 'easeOut' },
  slow: { duration: 0.6, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 25 },
  springBounce: { type: 'spring', stiffness: 400, damping: 20 },
} as const;

/**
 * Page Transition Variants
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Modal/Dialog Variants
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Backdrop Variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * List Item Variants (para mapeos)
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    },
  }),
};

/**
 * NUEVAS ANIMACIONES ELEGANTES
 */

/**
 * Float Animation - Para formas flotantes (nubes, blobs)
 */
export const floatAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Blob Morph Animation - Formas orgánicas que cambian
 */
export const blobMorph = {
  animate: {
    borderRadius: [
      '60% 40% 30% 70% / 60% 30% 70% 40%',
      '30% 60% 70% 40% / 50% 60% 30% 60%',
      '50% 50% 30% 70% / 30% 70% 70% 30%',
      '60% 40% 30% 70% / 60% 30% 70% 40%',
    ],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Gradient Shift Animation - Para gradientes animados
 */
export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Card Hover Elegant - Hover elegante para cards
 */
export const cardHoverElegant = {
  whileHover: {
    y: -12,
    scale: 1.02,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Shine Effect - Efecto de brillo al pasar el mouse
 */
export const shineEffect: Variants = {
  initial: {
    backgroundPosition: '-200% center',
  },
  hover: {
    backgroundPosition: '200% center',
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
};

/**
 * Reveal Animation - Revelar contenido con elegancia
 */
export const revealAnimation = (delay: number = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
});

/**
 * Stagger Grid - Para grids de cards/items
 */
export const staggerGrid = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Grid Item - Item individual del grid
 */
export const gridItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Hero Text Animation - Para títulos principales
 */
export const heroTextAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/**
 * Button Hover Elegant - Hover elegante para botones
 */
export const buttonHoverElegant = {
  whileHover: {
    scale: 1.05,
    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

/**
 * Slide Up Stagger - Para listas que suben con retraso
 */
export const slideUpStagger = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  },
};

/**
 * Decorative Blob - Para blobs decorativos de fondo
 */
export const decorativeBlob = (delay: number = 0) => ({
  animate: {
    x: [0, 30, -20, 0],
    y: [0, -30, 20, 0],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 15,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

