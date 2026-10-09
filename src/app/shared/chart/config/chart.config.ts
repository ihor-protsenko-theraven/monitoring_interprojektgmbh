import type { ChartKey } from '../types/chart.types';

export const CHART_KEYS = {
  deviation: 'devPct',
  absolute: 'abs',
  flowPressure: 'flowPressure',
  monthlyBaseline: 'monthlyBaseline',
} as const satisfies Record<string, ChartKey>;
export const CHART_STYLE = {
  borderWidth: 1.5,
  baselineWidth: 2,
  pointRadius: 0,
  deviationPointRadius: 2,
  monthlyPointRadius: 4,
  tension: 0.1,
  legendFontSize: 12,
  legendBoxWidth: 14,
  maxRotation: 45,
  maxTicks: 16,
  deviationMin: -100,
  deviationMax: 100,
  updateMode: 'none',
} as const;
export const CHART_OPTIONS = {
  type: 'line',
  interactionMode: 'index',
  axes: { flow: 'y', pressure: 'y1' },
  pressurePosition: 'right',
} as const;
