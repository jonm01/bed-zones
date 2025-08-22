'use client';

import * as React from 'react';
import { Stack, Slider, IconButton, Typography } from '@mui/material';
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
  /** Increment step for both slider and buttons. */
  step: number;
  /** Display unit label; defaults to Fahrenheit. */
  unit?: TempUnit;
  /** Callback fired when the temperature changes. */
  onChange: (value: number) => void;
}

/**
 * Control for adjusting a temperature.
 * Provides a slider for fast changes and +/- buttons for fine tuning.
 */
export function TemperatureControl({
  value,
  min,
  max,
  step,
  unit = 'F',
  onChange,
}: TemperatureControlProps) {
  const handleSlider = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return;
    const clamped = Math.min(max, Math.max(min, newValue));
    onChange(clamped);
  };

  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  return (
    <Stack spacing={1} alignItems="center">
      <Slider
        aria-label="temperature"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSlider}
        sx={{ width: 200, mt: 1 }}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => adjust(-step)}>
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ fontSize: 24, width: 72, textAlign: 'center' }}>
          {value}
          {`°${unit}`}
        </Typography>
        <IconButton onClick={() => adjust(step)}>
          <AddIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default TemperatureControl;

