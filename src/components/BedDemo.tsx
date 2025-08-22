'use client';

import * as React from 'react';
import {
  Stack,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  TextField,
} from '@mui/material';
import { BedDualZone, ZoneState } from './BedDualZone';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { ColorModeContext } from '@/theme';

type Side = 'left' | 'right';

export default function BedDemo() {
  const [zones, setZones] = React.useState<Record<Side, ZoneState>>({
    left: {
      mode: 'cool',
      currentTemp: 72,
      targetTemp: 68,
    },
    right: {
      mode: 'off',
      currentTemp: 70,
    },
  });
  const [editing, setEditing] = React.useState<Side>('left');
  const [unit, setUnit] = React.useState<'F' | 'C'>('F');
  const [page, setPage] = React.useState<'home' | 'settings'>('home');
  const [sideNames, setSideNames] = React.useState<{ left: string; right: string }>({
    left: 'Left',
    right: 'Right',
  });

  const updateZone = (side: Side, updater: (z: ZoneState) => ZoneState) =>
    setZones((z) => ({ ...z, [side]: updater(z[side]) }));

  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;
  const toUnit = (t: number) => (unit === 'C' ? Math.round(fToC(t) * 10) / 10 : Math.round(t));
  const fromUnit = (t: number) => (unit === 'C' ? cToF(t) : t);

  const tempCfg = unit === 'C'
    ? { min: 13, max: 43.5, mid: 28, step: 0.5 }
    : { min: 55, max: 110, mid: 82, step: 1 };

  const changeTemp = (side: Side, delta: number) =>
    updateZone(side, (z) => {
      const currentTarget = toUnit(z.targetTemp ?? fromUnit(tempCfg.mid));
      let next = currentTarget + delta;
      next = Math.min(tempCfg.max, Math.max(tempCfg.min, next));
      const nextF = fromUnit(next);
      const mode =
        z.mode === 'off'
          ? z.mode
          : nextF > z.currentTemp
          ? 'heat'
          : nextF < z.currentTemp
          ? 'cool'
          : 'off';
      return { ...z, targetTemp: nextF, mode };
    });

  const togglePower = (side: Side) =>
    updateZone(side, (z) => {
      if (z.mode === 'off') {
        const target = z.targetTemp ?? z.currentTemp;
        const mode = target > z.currentTemp ? 'heat' : target < z.currentTemp ? 'cool' : 'off';
        return { ...z, mode };
      }
      return { ...z, mode: 'off' };
    });

  const { mode, toggleMode } = React.useContext(ColorModeContext);

  return (
    <>
      {page === 'home' ? (
        <Stack
          spacing={2}
          sx={{ p: 2, maxWidth: 360, mx: 'auto', minHeight: '100vh', pb: 7, justifyContent: 'center' }}
        >
          <BedDualZone
            left={zones.left}
            right={zones.right}
            editingSide={editing}
            onSideClick={(s) => setEditing(s)}
            width={360}
            unit={unit}
            sideNames={sideNames}
          />

          <Tabs
            value={editing}
            onChange={(_, v) => v && setEditing(v)}
            aria-label="bed side controls"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label={sideNames.left} value="left" />
            <Tab label={sideNames.right} value="right" />
          </Tabs>

          {(() => {
            const z = zones[editing];
            const target = toUnit(z.targetTemp ?? fromUnit(tempCfg.mid));
            return (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <IconButton onClick={() => changeTemp(editing, -tempCfg.step)}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ fontSize: 24, width: 72, textAlign: 'center' }}>
                  {target}
                  {`°${unit}`}
                </Typography>
                <IconButton onClick={() => changeTemp(editing, tempCfg.step)}>
                  <AddIcon />
                </IconButton>
                <IconButton
                  color={z.mode === 'off' ? 'default' : 'secondary'}
                  onClick={() => togglePower(editing)}
                >
                  <PowerSettingsNewIcon />
                </IconButton>
              </Stack>
            );
          })()}
        </Stack>
      ) : (
        <Stack
          spacing={2}
          sx={{ p: 2, maxWidth: 360, mx: 'auto', minHeight: '100vh', pb: 7, pt: 4 }}
        >
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={() => toggleMode()} />}
            label="Dark mode"
          />
          <FormControlLabel
            control={<Switch checked={unit === 'C'} onChange={(e) => setUnit(e.target.checked ? 'C' : 'F')} />}
            label="Show °C"
          />
          <TextField
            label="Left name"
            value={sideNames.left}
            onChange={(e) => setSideNames((n) => ({ ...n, left: e.target.value }))}
          />
          <TextField
            label="Right name"
            value={sideNames.right}
            onChange={(e) => setSideNames((n) => ({ ...n, right: e.target.value }))}
          />
        </Stack>
      )}
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <BottomNavigation showLabels value={page} onChange={(_, v) => setPage(v)}>
          <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </AppBar>
    </>
  );
}
