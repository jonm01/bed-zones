'use client';

import * as React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha, useTheme, SxProps, Theme } from '@mui/material/styles';

type Side = 'left' | 'right';
type Mode = 'off' | 'cool' | 'heat';

/**
 * State for one half of the bed.
 * `mode` controls the color of the zone:
 * `cool` tints the zone blue, `heat` tints it red and `off` leaves it gray.
 * `currentTemp` displays the present temperature and `targetTemp` shows the
 * temperature the zone is heating or cooling toward. A `schedule` indicator can
 * show whether a program is running or when it will start next.
 */
export interface ZoneState {
  mode: Mode;
  /** Current sensed temperature. */
  currentTemp: number;
  /** Desired temperature when heating or cooling. */
  targetTemp?: number;
  /** Optional schedule information for the zone. */
  schedule?: { running: boolean; nextStart?: string };
}

/**
 * Visual representation of a dual-zone bed.
 * Each side displays its current and target temperature, mode, and optional
 * schedule information. The side being edited is highlighted.
 */
export interface BedDualZoneProps {
  /** State for the left zone. */
  left: ZoneState;
  /** State for the right zone. */
  right: ZoneState;
  /**
   * Side whose settings are being edited and therefore highlighted.
   * Clicking a zone should update this value in the parent component.
   */
  editingSide?: Side | null;
  /** Callback fired when a side is clicked. */
  onSideClick?: (side: Side) => void;
  /**
   * Maximum width of the rendered bed in pixels (default 360). The bed scales
   * down responsively on smaller screens.
   */
  width?: number;
  /** Optional labels displayed beneath each zone. */
  labels?: { left?: string; right?: string };
  /** Additional styles for the root element. */
  sx?: SxProps<Theme>;
}

export function BedDualZone({
  left,
  right,
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
    border: '1px solid',
    borderColor: 'divider',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition:
      'box-shadow .14s ease, transform .14s ease, opacity .14s ease, border-color .14s ease, background-color .14s ease',
    height: '100%',
    width: '100%',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
  } as const;

  const zoneStyleForMode = (mode: Mode) => {
    const highlight =
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(255,255,255,0.9)';
    const shadow =
      theme.palette.mode === 'dark'
        ? 'rgba(0,0,0,0.1)'
        : 'rgba(255,255,255,0.4)';

    if (mode === 'cool') {
      const c = theme.palette.info.main;
      return {
        background: `linear-gradient(180deg, ${highlight}, ${shadow}), ${alpha(c, 0.18)}`,
        borderColor: alpha(c, 0.45),
        '& .bdz-dot': { backgroundColor: c },
      };
    }
    if (mode === 'heat') {
      const c = theme.palette.error.main;
      return {
        background: `linear-gradient(180deg, ${highlight}, ${shadow}), ${alpha(c, 0.18)}`,
        borderColor: alpha(c, 0.45),
        '& .bdz-dot': { backgroundColor: c },
      };
    }
    return {
      background:
        theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${alpha(theme.palette.grey[800], 0.9)}, ${alpha(
              theme.palette.grey[700],
              0.9,
            )})`
          : 'linear-gradient(180deg, #fafafa, #e5e5e5)',
      borderColor: 'divider',
      '& .bdz-dot': { backgroundColor: theme.palette.grey[400] },
    };
  };

  return (
    <Box
      role="radiogroup"
      aria-label="Bed zones"
      sx={{
        width: '100%',
        maxWidth: width,
        mx: 'auto',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '28px',
          p: '6px',
          border: '1px solid',
          borderColor: 'divider',
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(180deg, ${alpha(theme.palette.grey[700], 0.6)}, ${alpha(
                  theme.palette.grey[800],
                  0.6,
                )})`
              : 'linear-gradient(180deg,#f5f5f5,#dcdcdc)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.5)'
              : '0 4px 12px rgba(0,0,0,0.15)',
          aspectRatio: '3 / 3.2',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 6,
            borderRadius: '20px',
            overflow: 'hidden',
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${alpha(theme.palette.grey[800], 0.9)}, ${alpha(
                    theme.palette.grey[700],
                    0.9,
                  )})`
                : 'linear-gradient(180deg,#fff,#e9e9e9)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* pillow */}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              left: 8,
              right: 8,
              height: '15%',
              borderRadius: '16px 16px 8px 8px',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha(
                      theme.palette.background.paper,
                      0.95,
                    )}, ${alpha(theme.palette.grey[800], 0.9)})`
                  : 'linear-gradient(180deg,#fff,#e0e0e0)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 4px rgba(0,0,0,0.4)'
                : '0 2px 4px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              height: '100%',
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '1px',
                bgcolor: 'divider',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            {zones.map(({ key, state }) => {
              const isEditing = editingSide === key;
              const ariaLabel = `${key} side: ${state.mode}${isEditing ? ', editing' : ''}`;

              return (
                <ButtonBase
                  key={key}
                  onClick={() => onSideClick?.(key)}
                  aria-label={ariaLabel}
                  aria-pressed={isEditing}
                  title={ariaLabel}
                  sx={{
                    ...baseZoneSx,
                    borderRadius: key === 'left' ? '16px 0 0 16px' : '0 16px 16px 0',
                    ...zoneStyleForMode(state.mode),
                    ...(isEditing
                      ? {
                          outline: `2px solid ${ring}`,
                          outlineOffset: -2,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 'inherit',
                            boxShadow: `0 0 6px ${editGlow}`,
                            pointerEvents: 'none',
                          },
                        }
                      : {}),
                    transform: 'none',
                    '&:hover': { transform: 'translateY(-1px)' },
                    '&:active': { transform: 'translateY(0)' },
                    opacity: editingSide && !isEditing ? 0.6 : 1,
                    zIndex: isEditing ? 2 : 0,
                  }}
                >
              {/* State pill */}
              <Typography
                component="span"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 10,
                  fontSize: { xs: 10, sm: 11 },
                  lineHeight: 1,
                  px: 1,
                  py: 0.5,
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
                {state.mode === 'cool'
                  ? 'Cooling'
                  : state.mode === 'heat'
                  ? 'Heating'
                  : 'Off'}
              </Typography>

              {/* Temperature display */}
              <Typography
                component="span"
                sx={{ fontSize: { xs: 24, sm: 32 }, fontWeight: 600 }}
              >
                {state.currentTemp}°
              </Typography>
              {state.mode !== 'off' && state.targetTemp !== undefined && (
                <Typography
                  component="span"
                  sx={{ fontSize: 12, mt: 0.5, color: 'text.secondary' }}
                >
                  {state.mode === 'cool' ? 'to cool' : 'to heat'} {state.targetTemp}°
                </Typography>
              )}
              {state.schedule && (
                <Typography
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: { xs: 9, sm: 11 },
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 8,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.default, 0.9)
                        : 'rgba(255,255,255,0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {state.schedule.running
                    ? 'Schedule running'
                    : state.schedule.nextStart
                    ? `Starts at ${state.schedule.nextStart}`
                    : ''}
                </Typography>
              )}

              {/* Colored dot */}
              <Box
                className="bdz-dot"
                aria-hidden
                sx={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  top: 12,
                  right: 10,
                  bgcolor: theme.palette.grey[400],
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              />
            </ButtonBase>
          );
        })}
          </Box>
        </Box>
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
