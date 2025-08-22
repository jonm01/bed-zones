'use client';

import * as React from 'react';
import { Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BedDualZone } from './BedDualZone';

type Mode = 'off' | 'cool' | 'heat';
type Side = 'left' | 'right';

export default function BedDemo() {
  const [left, setLeft] = React.useState<Mode>('cool');
  const [right, setRight] = React.useState<Mode>('off');
  const [editing, setEditing] = React.useState<Side>('left');

  const cycle = (m: Mode): Mode => (m === 'cool' ? 'heat' : m === 'heat' ? 'off' : 'cool');

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <BedDualZone
        left={{ mode: left }}
        right={{ mode: right }}
        editingSide={editing}
        onSideClick={(s) => setEditing(s)}
        labels={{ left: 'Left', right: 'Right' }}
        width={420}
      />

      <Stack direction="row" spacing={1}>
        <Button onClick={() => setLeft((m) => cycle(m))}>Cycle Left</Button>
        <Button onClick={() => setRight((m) => cycle(m))}>Cycle Right</Button>
        <Button onClick={() => setEditing((e) => (e === 'left' ? 'right' : 'left'))}>
          Toggle Editing Side
        </Button>
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
