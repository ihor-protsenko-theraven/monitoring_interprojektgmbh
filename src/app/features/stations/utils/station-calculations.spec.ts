import { computeDays, monthlyBaseline } from './station-calculations';
import { addDays } from '../../../shared/utils/date.utils';
import { RawRecord } from '../types/station.interfaces';
import { STATIONS_RAW } from '../data/stations.mock';

const series = (count: number): RawRecord[] =>
  Array.from({ length: count }, (_, i) => ({
    date: addDays('2026-01-01', i),
    Q_night: 100,
    P_night: 4,
  }));
describe('Station calculations', () => {
  it('requires 14 previous valid observations and excludes today', () => {
    const raw = series(15);
    raw[14] = { ...raw[14], Q_night: 200 };
    const days = computeDays(raw);
    expect(days[13].baseline).toBeNull();
    expect(days[14].baseline).toBe(100);
    expect(days[14].status).toBe('AVARIA');
    expect(days[14].dev_pct).toBe(100);
  });
  it('excludes outage observations but retains their negative deviation', () => {
    const raw = series(17);
    raw[15] = { ...raw[15], Q_night: 0, P_night: 0.5 };
    const days = computeDays(raw);
    expect(days[15].status).toBe('ZUPYNKA');
    expect(days[15].dev_pct).toBe(-100);
    expect(days[16].baseline).toBe(100);
  });
  it('uses a calendar window rather than the last 28 observations', () => {
    const raw = series(14);
    raw.push({ date: '2026-03-01', Q_night: 100, P_night: 4 });
    expect(computeDays(raw).at(-1)?.baseline).toBeNull();
  });
  it('uses strict > thresholds and handles missing pressure/flow', () => {
    for (const [flow, status] of [
      [125, 'NORMA'],
      [126, 'UVAGA'],
      [130, 'UVAGA'],
      [131, 'AVARIA'],
    ] as const) {
      const raw = series(15);
      raw[14] = { ...raw[14], Q_night: flow };
      expect(computeDays(raw)[14].status).toBe(status);
    }
    const raw = series(15);
    raw[14] = { ...raw[14], P_night: null };
    expect(computeDays(raw)[14].status).toBe('ZUPYNKA');
    raw[14] = { ...raw[14], P_night: 4, Q_night: null };
    expect(computeDays(raw)[14].status).toBe('NE_VYZNACH');
  });
  it('matches the reference window calculation on every mock observation', () => {
    for (const records of Object.values(STATIONS_RAW)) {
      for (const day of computeDays(records)) {
        const values = records
          .filter(
            (r) =>
              r.date >= addDays(day.date, -28) &&
              r.date < day.date &&
              r.P_night !== null &&
              r.P_night >= 1 &&
              r.Q_night !== null,
          )
          .map((r) => r.Q_night!);
        const baseline =
          values.length >= 14 ? values.reduce((a, b) => a + b, 0) / values.length : null;
        if (baseline === null) expect(day.baseline).toBeNull();
        else expect(day.baseline).toBeCloseTo(baseline, 8);
      }
    }
  });
  it('preserves reference current statuses and six-month aggregation', () => {
    expect(computeDays(STATIONS_RAW['kroshnya']).at(-1)?.status).toBe('NORMA');
    expect(computeDays(STATIONS_RAW['vitruka']).at(-1)?.status).toBe('AVARIA');
    expect(computeDays(STATIONS_RAW['pivnichnozahidna']).at(-1)?.status).toBe('ZUPYNKA');
    const days = computeDays(STATIONS_RAW['kroshnya']);
    const monthly = monthlyBaseline(days, days.at(-1)!.date);
    expect(monthly.labels).toEqual([
      '02.2026',
      '03.2026',
      '04.2026',
      '05.2026',
      '06.2026',
      '07.2026',
    ]);
  });
});
