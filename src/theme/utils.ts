/**
 * Theme utilities for consistent styling across the app
 */

export const themeClasses = {
  // Background colors
  bg: {
    primary: (isDark: boolean) => (isDark ? "bg-neutral-950" : "bg-neutral-50"),
    secondary: (isDark: boolean) =>
      isDark ? "bg-neutral-900" : "bg-neutral-100",
    tertiary: (isDark: boolean) =>
      isDark ? "bg-neutral-800" : "bg-neutral-200",
    hover: (isDark: boolean) =>
      isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100",
  },

  // Text colors
  text: {
    primary: (isDark: boolean) =>
      isDark ? "text-neutral-50" : "text-neutral-900",
    secondary: (isDark: boolean) =>
      isDark ? "text-neutral-200" : "text-neutral-700",
    tertiary: (isDark: boolean) =>
      isDark ? "text-neutral-400" : "text-neutral-500",
  },

  // Border colors
  border: (isDark: boolean) =>
    isDark ? "border-neutral-800" : "border-neutral-200",

  // Cards
  card: (isDark: boolean) =>
    isDark
      ? "bg-neutral-900 border-neutral-800"
      : "bg-white border-neutral-200",

  // Input styles
  input: (isDark: boolean) =>
    isDark
      ? "bg-neutral-800 border-neutral-700 text-neutral-50 placeholder-neutral-500"
      : "bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400",

  // Button styles
  button: {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: (isDark: boolean) =>
      isDark
        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-50"
        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900",
    ghost: (isDark: boolean) =>
      isDark
        ? "hover:bg-neutral-800 text-neutral-50"
        : "hover:bg-neutral-100 text-neutral-900",
  },

  // Status colors
  status: {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
  },
};

export const getThemeClass = (
  classes: string | ((isDark: boolean) => string),
  isDark: boolean,
): string => {
  return typeof classes === "function" ? classes(isDark) : classes;
};
