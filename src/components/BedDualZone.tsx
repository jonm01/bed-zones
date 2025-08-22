'use client';

import * as React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha, useTheme, SxProps, Theme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
  /** Names displayed for each side; defaults to "Left" and "Right". */
  sideNames?: { left?: string; right?: string };
  /**
   * Temperature unit used for display. Values in `left` and `right` are
   * assumed to be provided in Fahrenheit and will be converted if `unit` is
   * `'C'`.
   */
  unit?: 'F' | 'C';
  /** Additional styles for the root element. */
  sx?: SxProps<Theme>;
}

export function BedDualZone({
  left,
  right,
  editingSide = null,
  onSideClick,
  width = 360,
  sideNames,
  unit = 'F',
  sx,
}: BedDualZoneProps) {
  const theme = useTheme();
  const leftName = sideNames?.left ?? 'Left';
  const rightName = sideNames?.right ?? 'Right';
  const zones = [
    { key: 'left' as const, state: left, name: leftName },
    { key: 'right' as const, state: right, name: rightName },
  ];

  const ring = theme.palette.grey[200];
  const editGlow = alpha(theme.palette.secondary.main, 0.28);

  const baseZoneSx = {
    position: 'relative',
    border: '1px solid',
    borderColor: 'divider',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition:
      'box-shadow .14s ease, transform .14s ease, opacity .14s ease, border-color .14s ease, background-color .14s ease',
    height: '100%',
    width: '100%',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
    transform: 'none',
    '&:hover': { transform: 'translateY(-1px)' },
    '&:active': { transform: 'translateY(0)' },
  } as const;

  const highlight = 'rgba(255,255,255,0.05)';
  const shadow = 'rgba(0,0,0,0.1)';
  const baseBackground = `linear-gradient(180deg, ${alpha(
    theme.palette.grey[800],
    0.9,
  )}, ${alpha(theme.palette.grey[700], 0.9)})`;

  const tintBackground = (color: string) => ({
    background: `linear-gradient(180deg, ${highlight}, ${shadow}), ${alpha(color, 0.18)}`,
    borderColor: alpha(color, 0.45),
    '& .bdz-dot': { backgroundColor: color },
  });

  const modeStyles: Record<Mode, SxProps<Theme>> = {
    cool: tintBackground(theme.palette.info.main),
    heat: tintBackground(theme.palette.error.main),
    off: {
      background: baseBackground,
      borderColor: 'divider',
      '& .bdz-dot': { backgroundColor: theme.palette.grey[400] },
    },
  };

  const editingSx = {
    boxShadow: `inset 0 0 0 2px ${ring}, inset 0 1px 2px rgba(0,0,0,0.12)`,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      boxShadow: `0 0 6px ${editGlow}`,
      pointerEvents: 'none',
    },
    zIndex: 2,
  } as const;

  const formatTemp = (t: number) =>
    unit === 'C' ? Math.round(((t - 32) * 5) / 9) : Math.round(t);

  const unitLabel = `°${unit}`;

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
          background: `linear-gradient(180deg, ${alpha(theme.palette.grey[700], 0.6)}, ${alpha(
            theme.palette.grey[800],
            0.6,
          )})`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
            background: `linear-gradient(180deg, ${alpha(theme.palette.grey[800], 0.9)}, ${alpha(
              theme.palette.grey[700],
              0.9,
            )})`,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              height: '100%',
              zIndex: 1,
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
            {zones.map(({ key, state, name }) => {
              const isEditing = editingSide === key;
              const ariaLabel = `${name} side: ${state.mode}${isEditing ? ', editing' : ''}`;
              const scheduleLabel = state.schedule?.running
                ? 'Schedule running'
                : state.schedule?.nextStart
                ? `Starts at ${state.schedule.nextStart}`
                : undefined;
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
                    ...modeStyles[state.mode],
                    ...(isEditing ? editingSx : {}),
                    opacity: editingSide && !isEditing ? 0.6 : 1,
                  }}
                >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: key === 'left' ? 8 : 2,
                  right: key === 'left' ? 2 : 8,
                  height: '15%',
                  borderRadius:
                    key === 'left' ? '16px 8px 8px 8px' : '8px 16px 8px 8px',
                  background: `linear-gradient(180deg, ${alpha(
                    theme.palette.background.paper,
                    0.95,
                  )}, ${alpha(theme.palette.grey[800], 0.9)})`,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                }}
              />
              {/* Side label */}
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
                  bgcolor: alpha(theme.palette.background.default, 0.9),
                  border: '1px solid',
                  borderColor: 'divider',
                  backdropFilter: 'blur(2px)',
                  userSelect: 'none',
                }}
              >
                {name}
              </Typography>

              {/* Temperature display */}
              <Typography
                component="span"
                sx={{ fontSize: { xs: 24, sm: 32 }, fontWeight: 600 }}
              >
                {formatTemp(state.currentTemp)}{unitLabel}
              </Typography>

              {state.mode !== 'off' && state.targetTemp !== undefined && (
                <Typography
                  component="span"
                  sx={{ fontSize: 12, mt: 0.5, color: 'text.secondary', userSelect: 'none' }}
                >
                  {state.currentTemp === state.targetTemp
                    ? `Maintaining ${formatTemp(state.targetTemp)}${unitLabel}`
                    : `${state.mode === 'cool' ? 'Cooling to' : 'Heating to'} ${formatTemp(
                        state.targetTemp,
                      )}${unitLabel}`}
                </Typography>
              )}

              {scheduleLabel && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: { xs: 9, sm: 11 },
                    px: 1,
                    py: 0.25,
                    borderRadius: 8,
                    bgcolor: alpha(theme.palette.background.default, 0.9),
                    border: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 'inherit' }} />
                  {scheduleLabel}
                </Box>
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
    </Box>
  );
}
