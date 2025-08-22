'use client';

import * as React from 'react';
import { Stack, Button, Tabs, Tab, FormControlLabel, Switch } from '@mui/material';
import { BedDualZone, ZoneState } from './BedDualZone';
import { ColorModeContext } from '@/theme';

type Side = 'left' | 'right';

export default function BedDemo() {
  const [zones, setZones] = React.useState<Record<Side, ZoneState>>({
    left: {
      mode: 'cool',
      currentTemp: 72,
      targetTemp: 68,
      schedule: { running: false, nextStart: '22:00' },
    },
    right: {
      mode: 'off',
      currentTemp: 70,
    },
  });
  const [editing, setEditing] = React.useState<Side>('left');
  const [unit, setUnit] = React.useState<'F' | 'C'>('F');

  const updateZone = (side: Side, updater: (z: ZoneState) => ZoneState) =>
    setZones((z) => ({ ...z, [side]: updater(z[side]) }));

  const cycle = (z: ZoneState): ZoneState => {
    const nextMode = z.mode === 'cool' ? 'heat' : z.mode === 'heat' ? 'off' : 'cool';
    const targetTemp =
      nextMode === 'cool' ? z.currentTemp - 4 : nextMode === 'heat' ? z.currentTemp + 4 : undefined;
    return { ...z, mode: nextMode, targetTemp };
  };

  const adjustTemp = (side: Side, delta: number) =>
    updateZone(side, (z) => ({ ...z, currentTemp: z.currentTemp + delta }));

  const toggleSchedule = (side: Side) =>
    updateZone(side, (z) =>
      z.schedule?.running
        ? { ...z, schedule: { running: false, nextStart: '22:00' } }
        : { ...z, schedule: { running: true } },
    );

  const { mode, toggleMode } = React.useContext(ColorModeContext);

  return (
    <Stack
      spacing={2}
      sx={{ p: 2, maxWidth: 360, mx: 'auto', height: '100vh', justifyContent: 'center' }}
    >
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={() => toggleMode()} />}
          label="Dark mode"
          sx={{ mr: 0 }}
        />
        <FormControlLabel
          control={<Switch checked={unit === 'C'} onChange={(e) => setUnit(e.target.checked ? 'C' : 'F')} />}
          label="°C"
        />
      </Stack>
      <BedDualZone
        left={zones.left}
        right={zones.right}
        editingSide={editing}
        onSideClick={(s) => setEditing(s)}
        width={360}
        unit={unit}
      />

      <Tabs
        value={editing}
        onChange={(_, v) => v && setEditing(v)}
        aria-label="bed side controls"
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Left" value="left" />
        <Tab label="Right" value="right" />
      </Tabs>

      <Stack direction="row" spacing={1}>
        <Button onClick={() => updateZone(editing, cycle)}>Cycle Mode</Button>
        <Button onClick={() => adjustTemp(editing, 1)}>Temp +</Button>
        <Button onClick={() => adjustTemp(editing, -1)}>Temp -</Button>
        <Button onClick={() => toggleSchedule(editing)}>Toggle Schedule</Button>
      </Stack>
    </Stack>
  );
}
