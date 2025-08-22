"use client";

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { createAppTheme, ColorModeContext } from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  const toggleMode = React.useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  );
}
