import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';
import { formatMetric, stationDayView } from './station-presentation.utils';
import { computeDays } from './station-calculations';
import { STATIONS_RAW } from '../data/stations.mock';

registerLocaleData(uk);

describe('Station presentation', () => {
  it('formats missing, zero, positive and negative measurements in Ukrainian', () => {
    expect(formatMetric(null, '1.1-1', 'uk')).toBe('—');
    expect(formatMetric(0, '1.1-1', 'uk', true)).toBe('+0,0');
    expect(formatMetric(12.34, '1.1-1', 'uk', true)).toBe('+12,3');
    expect(formatMetric(-12.34, '1.1-1', 'uk', true)).toBe('-12,3');
    expect(formatMetric(4.2, '1.2-2', 'uk')).toBe('4,20');
  });

  it('keeps missing deviations separate from zero and preserves source records', () => {
    const day = computeDays(STATIONS_RAW['kroshnya'])[0];
    const view = stationDayView(day, 'uk');
    expect(view.dateLabel).toBe('01.01.2026');
    expect(view.percentDeviationLabel).toBe('—');
    expect(view.baselineLabel).toBe('—');
    expect(view.statusLabel).toBe('НЕ ВИЗНАЧЕНО');
    expect(day).not.toHaveProperty('dateLabel');
    expect(stationDayView({ ...day, dev_pct: 0 }, 'uk').percentDeviationLabel).toBe('+0,0%');
  });
});
