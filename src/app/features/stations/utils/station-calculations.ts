import { STATION_RULES, STATION_STATUS } from '../config/stations.config';
import { DATE_FORMAT } from '../../../shared/config/date.config';
import { addDays } from '../../../shared/utils/date.utils';
import type {
  DayRecord,
  RawRecord,
  MonthlyBaseline,
  MonthlyAccumulator,
} from '../types/station.interfaces';
import { StationStatus } from '../types/station.types';

/** Rolling calendar window, excluding today and outage days. O(n) after sorting. */
export function computeDays(raw: readonly RawRecord[]): readonly DayRecord[] {
  const records = [...raw].sort((a, b) => a.date.localeCompare(b.date));
  let left = 0;
  let sum = 0;
  let count = 0;
  const eligible = (r: RawRecord) =>
    r.P_night !== null && r.P_night >= STATION_RULES.minimumPressure && r.Q_night !== null;
  return records.map((record, index) => {
    const windowStart = addDays(record.date, -STATION_RULES.baselineWindowDays);
    while (left < index && records[left].date < windowStart) {
      const old = records[left++];
      if (eligible(old)) {
        sum -= old.Q_night!;
        count--;
      }
    }
    const baseline = count >= STATION_RULES.minimumValidObservations ? sum / count : null;
    const outage = record.P_night === null || record.P_night < STATION_RULES.minimumPressure;
    const threshold_warn =
      baseline === null
        ? null
        : baseline * (1 + STATION_RULES.warningPercent / STATION_RULES.percentScale);
    const threshold_alarm =
      baseline === null
        ? null
        : baseline * (1 + STATION_RULES.alarmPercent / STATION_RULES.percentScale);
    const dev_abs = baseline === null || record.Q_night === null ? null : record.Q_night - baseline;
    const dev_pct =
      dev_abs === null || baseline === null || baseline === 0
        ? null
        : (dev_abs / baseline) * STATION_RULES.percentScale;
    const status: StationStatus = outage
      ? STATION_STATUS.outage
      : baseline === null || record.Q_night === null
        ? STATION_STATUS.unknown
        : record.Q_night > threshold_alarm!
          ? STATION_STATUS.alarm
          : record.Q_night > threshold_warn!
            ? STATION_STATUS.warning
            : STATION_STATUS.normal;
    if (eligible(record)) {
      sum += record.Q_night!;
      count++;
    }
    return {
      ...record,
      outage,
      baseline,
      threshold_warn,
      threshold_alarm,
      dev_abs,
      dev_pct,
      status,
    };
  });
}

export function monthlyBaseline(days: readonly DayRecord[], today: string): MonthlyBaseline {
  const end = new Date(today + DATE_FORMAT.utcMidnight);
  const start = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (STATION_RULES.monthlyWindowMonths - 1), 1),
  )
    .toISOString()
    .slice(0, DATE_FORMAT.isoDateLength);
  const months = new Map<string, MonthlyAccumulator>();
  for (const day of days) {
    if (day.date < start || day.date > today || day.baseline === null) continue;
    const key = day.date.slice(0, DATE_FORMAT.isoMonthLength);
    const month = months.get(key) ?? { sum: 0, count: 0 };
    month.sum += day.baseline;
    month.count++;
    months.set(key, month);
  }
  return {
    labels: [...months.keys()].map((k) =>
      k.split(DATE_FORMAT.isoSeparator).reverse().join(DATE_FORMAT.displaySeparator),
    ),
    values: [...months.values()].map((m) => m.sum / m.count),
  };
}
