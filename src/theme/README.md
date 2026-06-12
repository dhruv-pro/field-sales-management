# Theme System Documentation

## Overview

A production-ready, comprehensive theme system with support for light/dark mode, extensive color palette, and consistent styling utilities.

## Features

- ✅ Light and Dark mode support
- ✅ Theme persistence in localStorage
- ✅ System preference detection
- ✅ Smooth transitions between themes
- ✅ Extended Tailwind color palette (primary, secondary, neutral, success, warning, error, info)
- ✅ Theme context and hooks for easy access
- ✅ Utility functions for consistent styling
- ✅ Global CSS dark mode support

## Files Structure

```
src/theme/
├── ThemeContext.tsx    # Theme provider and useTheme hook
├── colors.ts          # Color palette definitions
├── utils.ts           # Theme utility classes
└── index.css          # Global theme styles
```

## Usage

### Using Theme in Components

```tsx
import { useTheme } from "@/theme/ThemeContext";

const MyComponent = () => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <div
      className={isDark ? "bg-neutral-900 text-white" : "bg-white text-black"}
    >
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### Using Theme Utilities

```tsx
import { themeClasses, getThemeClass } from "@/theme/utils";
import { useTheme } from "@/theme/ThemeContext";

const MyComponent = () => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className={themeClasses.bg.primary(isDark)}>
      <h1 className={themeClasses.text.primary(isDark)}>Hello</h1>
      <button className={`${themeClasses.button.primary} px-4 py-2 rounded`}>
        Click Me
      </button>
    </div>
  );
};
```

## Color Palette

### Primary Colors

Used for main brand colors, active states, and primary actions.

- Range: `primary-50` to `primary-950`

### Secondary Colors

Used for secondary actions and accents.

- Range: `secondary-50` to `secondary-950`

### Neutral Colors

Used for text, borders, and backgrounds.

- Range: `neutral-50` (lightest) to `neutral-950` (darkest)

### Status Colors

- **Success**: Green palette for positive actions
- **Warning**: Yellow palette for caution
- **Error**: Red palette for errors/dangers
- **Info**: Blue palette for information

## Tailwind Integration

### Dark Mode

- Class-based dark mode: `<html class="dark">`
- Automatic class application via ThemeProvider
- Custom dark styles using `dark:` prefix

### Extended Theme Configuration

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... },
    },
    spacing: { ... },
    borderRadius: { ... },
    boxShadow: { ... },
  },
}
```

## Theme Persistence

- Theme preference saved to `localStorage` with key: `theme`
- On first load, checks localStorage then system preference
- Automatically updates `<html>` class on change
- Smooth CSS transitions during theme switch

## Global Styles

### Custom Scrollbar

Dark and light mode scrollbar styling for consistent UX.

### Smooth Transitions

All elements have smooth color transitions (300ms duration).

### Card Component

`.card` class for consistent card styling across app:

```tsx
<div className="card">Content</div>
```

## Best Practices

1. **Always use theme utilities** for consistency:

   ```tsx
   // ✅ Good
   className={themeClasses.text.primary(isDark)}

   // ❌ Avoid hardcoding colors
   className={isDark ? 'text-white' : 'text-black'}
   ```

2. **Use `useTheme` hook** for theme access:

   ```tsx
   const { mode, toggleTheme } = useTheme();
   ```

3. **Apply transitions** for smooth theme changes:

   ```tsx
   className = "transition-colors duration-300";
   ```

4. **Use Tailwind dark mode** when possible:
   ```tsx
   className = "bg-white dark:bg-neutral-900";
   ```

## Component Examples

### Button with Theme Support

```tsx
const Button = ({ children, variant = "primary" }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <button
      className={`
      px-4 py-2 rounded-lg font-medium
      transition-colors duration-200
      ${themeClasses.button[variant](isDark)}
    `}
    >
      {children}
    </button>
  );
};
```

### Card Component with Theme

```tsx
const Card = ({ children, title }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className={`card ${themeClasses.bg.secondary(isDark)}`}>
      <h2 className={themeClasses.text.primary(isDark)}>{title}</h2>
      {children}
    </div>
  );
};
```

## Browser Support

- Modern browsers with ES6+ support
- CSS custom properties support
- localStorage support
- CSS Grid and Flexbox support

## Performance Considerations

- Theme preference checked only on mount
- CSS transitions use GPU acceleration
- Minimal re-renders using React context optimization
- No inline style calculations on render

## Future Enhancements

- [ ] Additional theme presets (high contrast, etc.)
- [ ] Customizable color schemes per user
- [ ] Theme animation preferences
- [ ] Accessibility improvements (WCAG AA compliance)
- [ ] Theme reset/default styles
