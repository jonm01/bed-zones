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
export default function TemperatureControl({
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
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>());
  const frame = React.useRef<number | null>(null);
  const isFirst = React.useRef(true);
  const prevValue = React.useRef(value);
  const suppressScroll = React.useRef(false);
  const userScrolling = React.useRef(false);
  const scrollEndTimer = React.useRef<number | null>(null);

  const keyFor = React.useCallback((n: number) => n.toFixed(5), []);

  const bounce = (dir: 'min' | 'max') => {
    const el = containerRef.current;
    if (!el) return;
    el.animate(
      [
        { transform: 'translateY(0)' },
        { transform: `translateY(${dir === 'min' ? 8 : -8}px)` },
        { transform: 'translateY(0)' },
      ],
      { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' },
    );
  };

  const scrollToValue = React.useCallback(
    (v: number, smooth = true) => {
      const container = containerRef.current;
      const node = itemRefs.current.get(keyFor(v));
      if (!container || !node) return;
      const top =
        node.offsetTop - container.clientHeight / 2 + node.offsetHeight / 2;

      if (!smooth) {
        container.scrollTop = top;
        return;
      }

      const start = container.scrollTop;
      const diff = top - start;
      const duration = 400; // slower, gentler animation
      let startTime: number | null = null;

      if (frame.current) cancelAnimationFrame(frame.current);
      const step = (time: number) => {
        if (startTime === null) startTime = time;
        const t = Math.min(1, (time - startTime) / duration);
        // easeOutCubic for a mild finish
        const eased = 1 - Math.pow(1 - t, 3);
        container.scrollTop = start + diff * eased;
        if (t < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          frame.current = null;
        }
      };
      frame.current = requestAnimationFrame(step);
    },
    [keyFor],
  );

  const snap = React.useCallback(
    (v: number) =>
      Number(
        (
          Math.round((v - min) / step) * step + min
        ).toFixed(5),
      ),
    [min, step],
  );

  const adjust = (delta: number) => {
    suppressScroll.current = true;
    let next = value + delta;
    if (next < min) {
      next = min;
      bounce('min');
    } else if (next > max) {
      next = max;
      bounce('max');
    }
    next = snap(next);
    onChange(next);
    scrollToValue(next, true);
    setTimeout(() => {
      suppressScroll.current = false;
    }, 300);
  };

  React.useEffect(() => {
    if (prevValue.current !== value) {
      navigator.vibrate?.(5);
      prevValue.current = value;
    }
    if (!userScrolling.current) {
      suppressScroll.current = true;
      scrollToValue(value, !isFirst.current);
      const id = window.setTimeout(() => {
        suppressScroll.current = false;
      }, 400);
      isFirst.current = false;
      return () => window.clearTimeout(id);
    }
    isFirst.current = false;
  }, [value, scrollToValue]);

  const handleScroll = () => {
    if (suppressScroll.current || !containerRef.current) return;
    userScrolling.current = true;
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const container = containerRef.current!;
      const center = container.scrollTop + container.clientHeight / 2;
      let closest = value;
      let minDist = Number.POSITIVE_INFINITY;
      numbers.forEach((n) => {
        const node = itemRefs.current.get(keyFor(n));
        if (!node) return;
        const itemCenter = node.offsetTop + node.offsetHeight / 2;
        const dist = Math.abs(center - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = n;
        }
      });
      const snapped = snap(closest);
      if (snapped !== value) onChange(snapped);

      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >=
        container.scrollHeight - container.clientHeight;
      if ((atTop && snapped === min) || (atBottom && snapped === max)) {
        bounce(atTop ? 'min' : 'max');
      }
    });

    scrollEndTimer.current = window.setTimeout(() => {
      userScrolling.current = false;
    }, 100);
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
            overscrollBehavior: 'contain',
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box sx={{ height: 40 }} />
          {numbers.map((n) => (
            <Box
              key={n}
              ref={(el: HTMLDivElement | null) => {
                if (el) itemRefs.current.set(keyFor(n), el);
              }}
              sx={{
                height: 40,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                borderRadius: 2,
                border: '2px solid',
                borderColor: n === value ? 'primary.main' : 'transparent',
                fontWeight: n === value ? 600 : 400,
              }}
            >
              <Typography>{n}</Typography>
            </Box>
          ))}
          <Box sx={{ height: 40 }} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 20 }}>{`°${unit}`}</Typography>
      <IconButton onClick={() => adjust(step)}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
}

