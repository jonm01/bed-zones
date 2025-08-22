'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true, // nicer theming + less SSR flicker
  typography: {
    fontFamily: 'var(--font-roboto)', // wired to next/font in layout.tsx
  },
});

export default theme;
