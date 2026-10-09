import type { StationStatus, StatusFilter } from './station.types';

export interface RawRecord {
  readonly date: string;
  readonly Q_night: number | null;
  readonly P_night: number | null;
}
export interface StationMeta {
  readonly id: string;
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
}
export interface DayRecord extends RawRecord {
  readonly outage: boolean;
  readonly baseline: number | null;
  readonly threshold_warn: number | null;
  readonly threshold_alarm: number | null;
  readonly dev_abs: number | null;
  readonly dev_pct: number | null;
  readonly status: StationStatus;
}
export interface Station {
  readonly meta: StationMeta;
  readonly days: readonly DayRecord[];
  readonly today: DayRecord;
}

export interface DatePeriod {
  readonly from: string;
  readonly to: string;
}
export interface SelectedPeriod extends DatePeriod {
  readonly id: string;
}
export interface StatusPresentation {
  readonly label: string;
  readonly css: string;
  readonly color: string;
}
export interface StatusFilterOption {
  readonly value: StatusFilter;
  readonly label: string;
}
export interface MonthlyBaseline {
  labels: string[];
  values: number[];
}
export interface MonthlyAccumulator {
  sum: number;
  count: number;
}

export interface StationMetricView {
  readonly label: string;
  readonly value: string;
  readonly unit: string;
}
export interface StationDayView extends DayRecord {
  readonly dateLabel: string;
  readonly flowLabel: string;
  readonly pressureLabel: string;
  readonly baselineLabel: string;
  readonly absoluteDeviationLabel: string;
  readonly percentDeviationLabel: string;
  readonly statusLabel: string;
  readonly statusClass: string;
  readonly rowClass: string;
}
