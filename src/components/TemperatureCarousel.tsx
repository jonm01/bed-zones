import * as React from 'react';
import { Stack, Tabs, Tab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface TemperatureCarouselProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: 'F' | 'C';
}

export function TemperatureCarousel({ value, onChange, min, max, step, unit }: TemperatureCarouselProps) {
  const values = React.useMemo(() => {
    const arr: number[] = [];
    for (let v = min; v <= max + step / 2; v += step) {
      arr.push(Math.round(v * 10) / 10);
    }
    return arr;
  }, [min, max, step]);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
      <IconButton onClick={() => onChange(clamp(value - step))}>
        <RemoveIcon />
      </IconButton>
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ flex: 1, minHeight: 48 }}
      >
        {values.map((v) => (
          <Tab key={v} value={v} label={`${v}°${unit}`} sx={{ minHeight: 48 }} />
        ))}
      </Tabs>
      <IconButton onClick={() => onChange(clamp(value + step))}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}
