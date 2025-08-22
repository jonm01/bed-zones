'use client';

import * as React from 'react';
import { Stack, IconButton, Typography, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { TempUnit } from '@/utils/temperature';

export interface TemperatureControlProps {
  /** Current temperature in the selected unit. */
  value: number;
  /** Minimum allowed value. */
  min: number;
  /** Maximum allowed value. */
  max: number;
  /** Increment step for +/- buttons and input. */
  step: number;
  /** Display unit label; defaults to Fahrenheit. */
  unit?: TempUnit;
  /** Callback fired when the temperature changes. */
  onChange: (value: number) => void;
}

/**
 * Control for adjusting a temperature.
 * Provides a numeric input for quick jumps and +/- buttons for fine tuning.
 */
export function TemperatureControl({
  value,
  min,
  max,
  step,
  unit = 'F',
  onChange,
}: TemperatureControlProps) {
  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (Number.isNaN(next)) return;
    const clamped = Math.min(max, Math.max(min, next));
    onChange(clamped);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton onClick={() => adjust(-step)}>
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        value={value}
        onChange={handleInput}
        inputProps={{
          min,
          max,
          step,
          style: { textAlign: 'center', width: 72 },
        }}
        size="small"
      />
      <Typography sx={{ fontSize: 20 }}>{`°${unit}`}</Typography>
      <IconButton onClick={() => adjust(step)}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}

export default TemperatureControl;

