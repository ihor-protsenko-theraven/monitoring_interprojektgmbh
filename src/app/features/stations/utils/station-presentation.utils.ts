import { formatNumber } from '@angular/common';
import type { DayRecord, StationDayView } from '../types/station.interfaces';
import { STATUS, STATION_CSS, STATION_DISPLAY } from '../config/stations.config';
import { METRIC_FORMAT } from '../config/metrics.config';
import { formatDate } from '../../../shared/utils/date.utils';
export function formatMetric(
  value: number | null,
  digits: string,
  locale: string,
  signed = false,
): string {
  if (value === null) return STATION_DISPLAY.missingValue;
  const prefix = signed && value >= 0 ? METRIC_FORMAT.positiveSign : METRIC_FORMAT.empty;
  return prefix + formatNumber(value, locale, digits);
}
export function stationDayView(day: DayRecord, locale: string): StationDayView {
  const status = STATUS[day.status];
  const deviation = formatMetric(day.dev_pct, STATION_DISPLAY.flowDigits, locale, true);
  return {
    ...day,
    dateLabel: formatDate(day.date),
    flowLabel: formatMetric(day.Q_night, STATION_DISPLAY.flowDigits, locale),
    pressureLabel: formatMetric(day.P_night, STATION_DISPLAY.pressureDigits, locale),
    baselineLabel: formatMetric(day.baseline, STATION_DISPLAY.flowDigits, locale),
    absoluteDeviationLabel: formatMetric(day.dev_abs, STATION_DISPLAY.flowDigits, locale, true),
    percentDeviationLabel:
      day.dev_pct === null ? deviation : deviation + METRIC_FORMAT.percentSuffix,
    statusLabel: status.label,
    statusClass: STATION_CSS.statusText + status.css,
    rowClass: STATION_CSS.alertRow + status.css,
  };
}
