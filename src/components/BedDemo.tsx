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
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { toUnit, fromUnit } from '@/utils/temperature';
import TemperatureControl from './TemperatureControl';

type Side = 'left' | 'right';

export default function BedDemo() {
  const [zones, setZones] = React.useState<Record<Side, ZoneState>>({
    left: {
      mode: 'cool',
      currentTemp: 72,
      targetTemp: 68,
      schedule: { running: false },
    },
    right: {
      mode: 'off',
      currentTemp: 70,
      schedule: { running: false },
    },
  });
  const [editing, setEditing] = React.useState<Side>('left');
  const [unit, setUnit] = React.useState<'F' | 'C'>('F');
  const [page, setPage] = React.useState<'home' | 'settings' | 'schedule'>('home');
  const [sideNames, setSideNames] = React.useState<{ left: string; right: string }>({
    left: 'Left',
    right: 'Right',
  });

  const updateZone = (side: Side, updater: (z: ZoneState) => ZoneState) =>
    setZones((z) => ({ ...z, [side]: updater(z[side]) }));

  const tempCfg = unit === 'C'
    ? { min: 13, max: 43.5, mid: 28, step: 0.5 }
    : { min: 55, max: 110, mid: 82, step: 1 };

  const setTemp = (side: Side, next: number) =>
    updateZone(side, (z) => {
      const clamped = Math.min(tempCfg.max, Math.max(tempCfg.min, next));
      const nextF = fromUnit(clamped, unit);
      const mode =
        z.mode === 'off'
          ? z.mode
          : nextF > z.currentTemp
          ? 'heat'
          : nextF < z.currentTemp
          ? 'cool'
          : z.mode;
      return { ...z, targetTemp: nextF, mode };
    });

  const togglePower = (side: Side) =>
    updateZone(side, (z) => {
      if (z.mode === 'off') {
        const target = z.targetTemp ?? z.currentTemp;
        const mode =
          target > z.currentTemp ? 'heat' : target < z.currentTemp ? 'cool' : 'heat';
        return { ...z, mode, targetTemp: target };
      }
      return { ...z, mode: 'off' };
    });

  const toggleSchedule = (side: Side, running: boolean) =>
    updateZone(side, (z) => ({ ...z, schedule: { ...z.schedule, running } }));

  const setScheduleStart = (side: Side, nextStart: string) =>
    updateZone(side, (z) => ({
      ...z,
      schedule: { running: z.schedule?.running ?? false, nextStart },
    }));


  const pageTitle = page === 'home' ? 'Home' : page === 'settings' ? 'Settings' : 'Schedule';

  return (
    <>
      <Typography variant="h6" align="center" sx={{ mt: 1 }}>
        {pageTitle}
      </Typography>
      {page === 'home' ? (
        <Stack
          spacing={2}
          sx={{ p: 2, maxWidth: 360, mx: 'auto', minHeight: 'calc(100vh - 56px)', pb: 7, alignItems: 'center' }}
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
            const target = toUnit(z.targetTemp ?? fromUnit(tempCfg.mid, unit), unit);
            return (
              <Stack direction="row" spacing={2} alignItems="center">
                <TemperatureControl
                  value={target}
                  min={tempCfg.min}
                  max={tempCfg.max}
                  step={tempCfg.step}
                  unit={unit}
                  onChange={(v) => setTemp(editing, v)}
                />
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
      ) : page === 'settings' ? (
        <Stack
          spacing={2}
          sx={{ p: 2, maxWidth: 360, mx: 'auto', minHeight: 'calc(100vh - 56px)', pb: 7 }}
        >
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
      ) : (
        <Stack
          spacing={2}
          sx={{ p: 2, maxWidth: 360, mx: 'auto', minHeight: 'calc(100vh - 56px)', pb: 7, alignItems: 'center' }}
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
            aria-label="schedule controls"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label={sideNames.left} value="left" />
            <Tab label={sideNames.right} value="right" />
          </Tabs>

          <FormControlLabel
            control={
              <Switch
                checked={!!zones[editing].schedule?.running}
                onChange={(e) => toggleSchedule(editing, e.target.checked)}
              />
            }
            label="Schedule running"
          />

          <TextField
            label="Starts at"
            type="time"
            value={zones[editing].schedule?.nextStart ?? ''}
            onChange={(e) => setScheduleStart(editing, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      )}
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <BottomNavigation showLabels value={page} onChange={(_, v) => setPage(v)}>
          <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Schedule" value="schedule" icon={<ScheduleIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </AppBar>
    </>
  );
}
