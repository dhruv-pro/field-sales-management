export const colors = {
  // Primary colors
  primary: {
    50: "#f8f9ff",
    100: "#f0f3ff",
    200: "#e5ecff",
    300: "#d4deff",
    400: "#b8c9ff",
    500: "#9fb3ff",
    600: "#7c8fff",
    700: "#5b6aff",
    800: "#4252ff",
    900: "#2835ff",
    950: "#1a1fff",
  },

  // Secondary colors
  secondary: {
    50: "#f8f7ff",
    100: "#f0edff",
    200: "#e5dfff",
    300: "#d4c9ff",
    400: "#b8a8ff",
    500: "#9f8cff",
    600: "#7c68ff",
    700: "#5b48ff",
    800: "#4232ff",
    900: "#281fff",
    950: "#1a0fff",
  },

  // Neutral colors
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Success
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#145231",
  },

  // Warning
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Error/Danger
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Info
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c3d66",
  },
};

export const lightTheme = {
  bg: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    tertiary: colors.neutral[200],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[700],
    tertiary: colors.neutral[500],
  },
  border: colors.neutral[200],
  hover: colors.neutral[100],
};

export const darkTheme = {
  bg: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[200],
    tertiary: colors.neutral[400],
  },
  border: colors.neutral[800],
  hover: colors.neutral[900],
};
