'use client';
import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  cssVariables: true,
  palette: { mode: 'dark' },
  typography: {
    fontFamily: 'var(--font-roboto)', // wired to next/font in layout.tsx
  },
});
