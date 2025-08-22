"use client";
import type { Metadata } from 'next';
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { createAppTheme, ColorModeContext } from '@/theme';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Bed Zones',
  description: 'Two-zone bed UI demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  const toggleMode = React.useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <ColorModeContext.Provider value={{ mode, toggleMode }}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ColorModeContext.Provider>
      </body>
    </html>
  );
}
