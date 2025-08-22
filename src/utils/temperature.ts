export type TempUnit = 'F' | 'C';

/** Convert Fahrenheit to Celsius. */
export const fToC = (f: number): number => ((f - 32) * 5) / 9;

/** Convert Celsius to Fahrenheit. */
export const cToF = (c: number): number => (c * 9) / 5 + 32;

/**
 * Convert a temperature from stored Fahrenheit to the display unit.
 * Fahrenheit values are rounded to whole numbers, Celsius to halves.
 */
export const toUnit = (tempF: number, unit: TempUnit): number =>
  unit === 'C' ? Math.round(fToC(tempF) * 2) / 2 : Math.round(tempF);

/** Convert a value from the display unit back to Fahrenheit. */
export const fromUnit = (temp: number, unit: TempUnit): number =>
  unit === 'C' ? cToF(temp) : temp;

/**
 * Format a Fahrenheit temperature for display in the selected unit.
 * Fahrenheit is shown with one decimal precision, Celsius with half degrees.
 */
export const formatTemp = (tempF: number, unit: TempUnit): number =>
  unit === 'C' ? Math.round(fToC(tempF) * 2) / 2 : Math.round(tempF * 10) / 10;

