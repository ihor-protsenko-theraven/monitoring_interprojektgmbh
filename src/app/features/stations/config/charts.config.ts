import { STATION_RULES } from './stations.config';
import type { ChartKey } from '../../../shared/chart/types/chart.types';

export const CHART_TITLES: Record<ChartKey, string> = {
  devPct: 'Відхилення від базової лінії, %',
  abs: 'Нічна витрата та базова лінія, м³/год',
  flowPressure: 'Нічна витрата й тиск',
  monthlyBaseline: 'Базова лінія за місяцями',
};

export const CHART_LABELS = {
  flowUnit: 'м³/год',
  pressureUnit: 'бар',
  deviation: 'Відхилення від бази',
  upperWarning: `Попередження (+${STATION_RULES.warningPercent}%)`,
  upperAlarm: `Аварія (+${STATION_RULES.alarmPercent}%)`,
  flow: 'Нічна витрата',
  baseline: `Базова лінія (${STATION_RULES.baselineWindowDays} діб)`,
  warning: `Попередження (+${STATION_RULES.warningPercent}%)`,
  alarm: `Аварія (+${STATION_RULES.alarmPercent}%)`,
  flowPressure: 'Нічна витрата, м³/год',
  pressure: 'Тиск, бар',
  monthlyBaseline: 'Середня базова лінія',
  monthlyDescription: `Останні ${STATION_RULES.monthlyWindowMonths} місяців від опорної доби — не залежить від фільтра періоду вище`,
} as const;
