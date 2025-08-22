'use client';

import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export interface RadialSliderProps {
  value: number;
  current: number;
  min: number;
  max: number;
  step: number;
  unit: 'F' | 'C';
  mode: 'heat' | 'cool' | 'off';
  onChange: (value: number) => void;
}

export function RadialSlider({
  value,
  current,
  min,
  max,
  step,
  unit,
  mode,
  onChange,
}: RadialSliderProps) {
  const theme = useTheme();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const size = 200;
  const radius = 80;
  const stroke = 12;
  const cx = size / 2;
  const cy = radius + stroke / 2;

  const color =
    mode === 'heat'
      ? theme.palette.error.main
      : mode === 'cool'
      ? theme.palette.info.main
      : theme.palette.grey[400];

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size;
    canvas.height = cy + stroke;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0, true);
    ctx.strokeStyle = theme.palette.grey[400];
    ctx.stroke();

    // Active arc
    const pct = (value - min) / (max - min);
    const angle = Math.PI - pct * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, angle, true);
    ctx.strokeStyle = color;
    ctx.stroke();

    // Knob
    const kx = cx + radius * Math.cos(angle);
    const ky = cy - radius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(kx, ky, stroke / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [value, min, max, color, cx, cy, radius, stroke, theme.palette.grey]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = cy - y;
    let theta = Math.atan2(dy, dx);
    if (theta < 0) theta = 0;
    if (theta > Math.PI) theta = Math.PI;
    const pct = theta / Math.PI;
    let val = min + (1 - pct) * (max - min);
    val = Math.round(val / step) * step;
    val = Math.min(max, Math.max(min, val));
    onChange(val);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) handlePointer(e);
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      />
      <Typography sx={{ mt: 1, fontSize: 20, fontWeight: 600 }}>
        {mode === 'heat' ? 'Warming to' : mode === 'cool' ? 'Cooling to' : 'Set to'}{' '}
        {value}
        {`°${unit}`}
      </Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
        Currently at {current}
        {`°${unit}`}
      </Typography>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <IconButton
          size="small"
          onClick={() => onChange(Math.max(min, Math.round((value - step) / step) * step))}
        >
          <RemoveIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onChange(Math.min(max, Math.round((value + step) / step) * step))}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default RadialSlider;

