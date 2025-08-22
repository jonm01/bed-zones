'use client';

import * as React from 'react';
import { Stack, Button, Tabs, Tab } from '@mui/material';
import { BedDualZone, ZoneState } from './BedDualZone';

type Side = 'left' | 'right';

export default function BedDemo() {
  const [left, setLeft] = React.useState<ZoneState>({
    mode: 'cool',
    currentTemp: 72,
    targetTemp: 68,
    schedule: { running: false, nextStart: '22:00' },
  });
  const [right, setRight] = React.useState<ZoneState>({
    mode: 'off',
    currentTemp: 70,
  });
  const [editing, setEditing] = React.useState<Side>('left');

  const cycle = (z: ZoneState): ZoneState => {
    const nextMode = z.mode === 'cool' ? 'heat' : z.mode === 'heat' ? 'off' : 'cool';
    const targetTemp =
      nextMode === 'cool' ? z.currentTemp - 4 : nextMode === 'heat' ? z.currentTemp + 4 : undefined;
    return { ...z, mode: nextMode, targetTemp };
  };

  const adjustTemp = (side: Side, delta: number) => {
    if (side === 'left') {
      setLeft((z) => ({ ...z, currentTemp: z.currentTemp + delta }));
    } else {
      setRight((z) => ({ ...z, currentTemp: z.currentTemp + delta }));
    }
  };

  const toggleSchedule = (side: Side) => {
    const updater = (z: ZoneState) =>
      z.schedule?.running
        ? { ...z, schedule: { running: false, nextStart: '22:00' } }
        : { ...z, schedule: { running: true } };
    if (side === 'left') setLeft(updater);
    else setRight(updater);
  };

  return (
    <Stack
      spacing={2}
      sx={{ p: 2, maxWidth: 360, mx: 'auto', height: '100vh', justifyContent: 'center' }}
    >
      <BedDualZone
        left={left}
        right={right}
        editingSide={editing}
        onSideClick={(s) => setEditing(s)}
        labels={{ left: 'Left', right: 'Right' }}
        width={360}
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

      {editing === 'left' && (
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setLeft((z) => cycle(z))}>Cycle Mode</Button>
          <Button onClick={() => adjustTemp('left', 1)}>Temp +</Button>
          <Button onClick={() => adjustTemp('left', -1)}>Temp -</Button>
          <Button onClick={() => toggleSchedule('left')}>Toggle Schedule</Button>
        </Stack>
      )}
      {editing === 'right' && (
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setRight((z) => cycle(z))}>Cycle Mode</Button>
          <Button onClick={() => adjustTemp('right', 1)}>Temp +</Button>
          <Button onClick={() => adjustTemp('right', -1)}>Temp -</Button>
          <Button onClick={() => toggleSchedule('right')}>Toggle Schedule</Button>
        </Stack>
      )}
    </Stack>
  );
}
