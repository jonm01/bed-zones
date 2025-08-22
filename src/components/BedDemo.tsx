'use client';

import * as React from 'react';
import { Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
    <Stack spacing={2} sx={{ p: 3 }}>
      <BedDualZone
        left={left}
        right={right}
        editingSide={editing}
        onSideClick={(s) => setEditing(s)}
        labels={{ left: 'Left', right: 'Right' }}
        width={420}
      />

      <Stack direction="row" spacing={1}>
        <Button onClick={() => setLeft((z) => cycle(z))}>Cycle Left Mode</Button>
        <Button onClick={() => setRight((z) => cycle(z))}>Cycle Right Mode</Button>
        <Button onClick={() => adjustTemp(editing, 1)}>Temp +</Button>
        <Button onClick={() => adjustTemp(editing, -1)}>Temp -</Button>
        <Button onClick={() => toggleSchedule(editing)}>Toggle Schedule</Button>
        <Button onClick={() => setEditing((e) => (e === 'left' ? 'right' : 'left'))}>Toggle Editing</Button>
      </Stack>

      <ToggleButtonGroup
        exclusive
        value={editing}
        onChange={(_, v) => v && setEditing(v)}
        size="small"
      >
        <ToggleButton value="left">Select Left</ToggleButton>
        <ToggleButton value="right">Select Right</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
