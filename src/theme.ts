'use client';
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    cssVariables: true, // nicer theming + less SSR flicker
    palette: { mode },
    typography: {
      fontFamily: 'var(--font-roboto)', // wired to next/font in layout.tsx
    },
  });
}

export const ColorModeContext = React.createContext<{
  mode: PaletteMode;
  toggleMode: () => void;
}>({
  mode: 'light',
  toggleMode: () => {},
});

