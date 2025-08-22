'use client';

import * as React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

type Side = 'left' | 'right';
type Mode = 'off' | 'cool' | 'heat';
export interface ZoneState { mode: Mode }

export interface BedDualZoneProps {
  left: ZoneState;
  right: ZoneState;
  selectedSide?: Side | null;     // radio-style selected side
  editingSide?: Side | null;      // which side is being edited (extra glow)
  onSideClick?: (side: Side) => void;
  width?: number;                  // px, default 360
  labels?: { left?: string; right?: string };
  sx?: any;                        // optional extra sx
}

export function BedDualZone({
  left,
  right,
  selectedSide = null,
  editingSide = null,
  onSideClick,
  width = 360,
  labels,
  sx,
}: BedDualZoneProps) {
  const theme = useTheme();
  const zones = [
    { key: 'left' as const, state: left, label: labels?.left ?? 'Left' },
    { key: 'right' as const, state: right, label: labels?.right ?? 'Right' },
  ];

  const ring = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[900];
  const editGlow = alpha(theme.palette.secondary.main, 0.28);

  const baseZoneSx = {
    position: 'relative',
    borderRadius: '16px',
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[800], 0.5)
        : theme.palette.grey[50],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow .14s ease, transform .08s ease, border-color .14s ease, background-color .14s ease',
    height: '100%',
    width: '100%',
    '&:hover': { transform: 'translateY(-1px)' },
    '&:active': { transform: 'translateY(0)' },
  } as const;

  const zoneStyleForMode = (mode: Mode) => {
    if (mode === 'cool') {
      const c = theme.palette.info.main;
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,0)), ${alpha(c, 0.12)}`,
        borderColor: alpha(c, 0.45),
        '& .bdz-dot': { backgroundColor: c },
      };
    }
    if (mode === 'heat') {
      const c = theme.palette.error.main;
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,0)), ${alpha(c, 0.12)}`,
        borderColor: alpha(c, 0.45),
        '& .bdz-dot': { backgroundColor: c },
      };
    }
    return {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.grey[800], 0.5)
          : theme.palette.grey[50],
      borderColor: 'divider',
      '& .bdz-dot': { backgroundColor: theme.palette.grey[400] },
    };
  };

  return (
    <Box
      role="radiogroup"
      aria-label="Bed zones"
      sx={{
        width,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '18px',
          p: '2px',
          bgcolor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === 'dark'
              ? undefined
              : '0 1px 1.5px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.03)',
          aspectRatio: '7 / 4',
        }}
      >
        {zones.map(({ key, state, label }) => {
          const isSelected = selectedSide === key;
          const isEditing = editingSide === key;
          const ariaLabel = `${key} side: ${state.mode}${isSelected ? ', selected' : ''}${isEditing ? ', editing' : ''}`;

          return (
            <ButtonBase
              key={key}
              onClick={() => onSideClick?.(key)}
              aria-label={ariaLabel}
              aria-pressed={isSelected}
              title={ariaLabel}
              sx={{
                ...baseZoneSx,
                ...zoneStyleForMode(state.mode),
                boxShadow: isEditing
                  ? `inset 0 0 0 2px ${ring}, 0 0 0 6px ${editGlow}`
                  : isSelected
                  ? `inset 0 0 0 2px ${ring}`
                  : undefined,
              }}
            >
              {/* State pill */}
              <Typography
                component="span"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 12,
                  fontSize: 12,
                  lineHeight: 1,
                  px: 1,
                  py: 0.75,
                  borderRadius: 999,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.default, 0.9)
                      : 'rgba(255,255,255,0.9)',
                  border: '1px solid',
                  borderColor: 'divider',
                  backdropFilter: 'blur(2px)',
                  userSelect: 'none',
                }}
              >
                {state.mode === 'cool' ? 'Cooling' : state.mode === 'heat' ? 'Heating' : 'Off'}
              </Typography>

              {/* Colored dot */}
              <Box
                className="bdz-dot"
                aria-hidden
                sx={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  top: 14,
                  right: 12,
                  bgcolor: theme.palette.grey[400],
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              />
            </ButtonBase>
          );
        })}
      </Box>

      {(labels?.left || labels?.right) && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', mt: 1, fontSize: 12, color: 'text.secondary' }} aria-hidden>
          <span>{labels?.left ?? ''}</span>
          <span style={{ textAlign: 'right' }}>{labels?.right ?? ''}</span>
        </Box>
      )}
    </Box>
  );
}
