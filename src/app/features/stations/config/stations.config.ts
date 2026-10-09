import { THEME_COLORS } from '../../../shared/config/theme.config';
import type {
  StationMeta,
  StatusPresentation,
  StatusFilterOption,
} from '../types/station.interfaces';
import type { StationStatus } from '../types/station.types';

export const STATIONS_META: readonly StationMeta[] = [
  { id: 'kroshnya', name: 'ВНС «Крошня»', lat: 50.27922165, lng: 28.662207 },
  { id: 'vitruka', name: 'ВНС «Вітрука»', lat: 50.24830518, lng: 28.69907381 },
  { id: 'pivnichnozahidna', name: 'ВНС «Північно-Західна»', lat: 50.27509415, lng: 28.63314679 },
];
export const STATUS: Readonly<Record<StationStatus, StatusPresentation>> = {
  NORMA: { label: 'НОРМА', css: 'norma', color: THEME_COLORS['success'] },
  UVAGA: { label: 'УВАГА', css: 'uvaga', color: THEME_COLORS['warning'] },
  AVARIA: { label: 'АВАРІЯ', css: 'avaria', color: THEME_COLORS['danger'] },
  ZUPYNKA: { label: 'ЗУПИНКА', css: 'zupynka', color: THEME_COLORS['text-muted'] },
  NE_VYZNACH: { label: 'НЕ ВИЗНАЧЕНО', css: 'ne-vyznach', color: THEME_COLORS['text-muted'] },
};

export const STATION_STATUS = {
  normal: 'NORMA',
  warning: 'UVAGA',
  alarm: 'AVARIA',
  outage: 'ZUPYNKA',
  unknown: 'NE_VYZNACH',
} as const satisfies Record<string, StationStatus>;
export const ALL_STATUSES = 'ALL';
export const STATUS_FILTERS: readonly StatusFilterOption[] = [
  { value: ALL_STATUSES, label: 'Всі' },
  { value: STATION_STATUS.warning, label: 'Увага' },
  { value: STATION_STATUS.alarm, label: 'Аварія' },
  { value: STATION_STATUS.outage, label: 'Зупинка' },
  { value: STATION_STATUS.unknown, label: 'Не визначено' },
];
export const STATION_RULES = {
  baselineWindowDays: 28,
  minimumValidObservations: 14,
  minimumPressure: 1,
  warningPercent: 25,
  alarmPercent: 30,
  monthlyWindowMonths: 6,
  defaultPeriodDays: 30,
  percentScale: 100,
} as const;
export const STATION_DISPLAY = {
  observationTime: '03:00',
  flowDigits: '1.1-1',
  pressureDigits: '1.2-2',
  missingValue: '—',
} as const;

export const STATION_CSS = {
  statusText: 'status-text st-',
  alertRow: 'notification-row ',
  stationStatus: 'station-status-label st-',
  stationCard: 'station-card status-',
  detailStatus: 'nested-status-pill st-',
} as const;
