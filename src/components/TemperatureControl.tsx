'use client';

import * as React from 'react';
import { Stack, IconButton, Typography, Box } from '@mui/material';
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
  /** Increment step for +/- buttons and carousel. */
  step: number;
  /** Display unit label; defaults to Fahrenheit. */
  unit?: TempUnit;
  /** Callback fired when the temperature changes. */
  onChange: (value: number) => void;
}

/**
 * Control for adjusting a temperature.
 * Renders a vertical wheel of numbers for rapid sliding along with +/- buttons for fine tuning.
 */
export function TemperatureControl({
  value,
  min,
  max,
  step,
  unit = 'F',
  onChange,
}: TemperatureControlProps) {
  const numbers = React.useMemo(() => {
    const arr: number[] = [];
    for (let n = min; n <= max; n = Number((n + step).toFixed(10))) {
      arr.push(Number(n.toFixed(5)));
    }
    return arr;
  }, [min, max, step]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef(new Map<number, HTMLDivElement>());
  const frame = React.useRef<number>();

  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  const scrollToValue = React.useCallback(
    (v: number, smooth = true) => {
      const node = itemRefs.current.get(v);
      node?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center',
      });
    },
    [],
  );

  React.useEffect(() => {
    scrollToValue(value, false);
  }, [value, scrollToValue]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const container = containerRef.current!;
      const center = container.scrollTop + container.clientHeight / 2;
      let closest = value;
      let minDist = Number.POSITIVE_INFINITY;
      numbers.forEach((n) => {
        const node = itemRefs.current.get(n);
        if (!node) return;
        const itemCenter = node.offsetTop + node.offsetHeight / 2;
        const dist = Math.abs(center - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = n;
        }
      });
      if (closest !== value) onChange(closest);
    });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton onClick={() => adjust(-step)}>
        <RemoveIcon />
      </IconButton>
      <Box sx={{ position: 'relative', height: 120, width: 60 }}>
        <Box
          ref={containerRef}
          onScroll={handleScroll}
          sx={{
            height: '100%',
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box sx={{ height: 40 }} />
          {numbers.map((n) => (
            <Box
              key={n}
              ref={(el: HTMLDivElement | null) => {
                if (el) itemRefs.current.set(n, el);
              }}
              sx={{
                height: 40,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                borderRadius: 1,
                bgcolor: n === value ? 'primary.main' : 'transparent',
                color: n === value ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <Typography>{n}</Typography>
            </Box>
          ))}
          <Box sx={{ height: 40 }} />
        </Box>
        <Box
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 40,
            transform: 'translateY(-50%)',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
      </Box>
      <Typography sx={{ fontSize: 20 }}>{`°${unit}`}</Typography>
      <IconButton onClick={() => adjust(step)}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}

export default TemperatureControl;

