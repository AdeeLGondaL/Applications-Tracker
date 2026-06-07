/**
 * Centralized Design System - Premium Applume Theme
 * Establishes consistent visual language across the product
 */

export const colors = {
  // Primary: Emerald (from logo)
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#16a34a',
    600: '#15803d',
    700: '#166534',
    800: '#166534',
    900: '#0f2818',
  },

  // Neutrals: Refined grayscale for premium feel
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    150: '#efefef',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors
  success: '#16a34a',
  warning: '#eab308',
  error: '#dc2626',
  info: '#3b82f6',

  // Dark mode specific
  dark: {
    bg: '#09090b',
    surface: '#1c1c1f',
    border: '#2a2a2e',
    text: '#f0f0f0',
    textSecondary: '#a1a1aa',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
};

export const typography = {
  // Headline styles - Bold, commanding
  h1: {
    fontSize: '3rem',
    lineHeight: '3.5rem',
    fontWeight: '900',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    lineHeight: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: '700',
  },
  h4: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: '700',
  },

  // Body styles - Clear, readable
  body: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: '400',
  },
  bodySm: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: '400',
  },
  bodyXs: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: '400',
  },

  // Labels & small text
  label: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    letterSpacing: '0.005em',
  },
};

export const shadows = {
  // Subtle shadows for modern, premium feel
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const borderRadius = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  full: '9999px',
};

export const transitions = {
  fast: 'all 0.15s ease-in-out',
  base: 'all 0.3s ease-in-out',
  slow: 'all 0.5s ease-in-out',
};

export default {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
};
