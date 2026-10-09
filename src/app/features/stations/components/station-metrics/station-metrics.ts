import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';
import type { DayRecord, StationMetricView } from '../../types/station.interfaces';
import { STATION_DISPLAY } from '../../config/stations.config';
import { METRIC_TEXT, METRIC_FORMAT } from '../../config/metrics.config';
import { formatMetric } from '../../utils/station-presentation.utils';
@Component({
  selector: 'app-station-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './station-metrics.html',
  styleUrl: './station-metrics.scss',
})
export class StationMetrics {
  readonly day = input.required<DayRecord>();
  readonly compact = input(false);
  private readonly locale = inject(LOCALE_ID);
  readonly metrics = computed<readonly StationMetricView[]>(() => {
    const day = this.day();
    const metrics: StationMetricView[] = [
      {
        label: METRIC_TEXT.flow,
        value: formatMetric(day.Q_night, STATION_DISPLAY.flowDigits, this.locale),
        unit: day.Q_night === null ? METRIC_FORMAT.empty : METRIC_TEXT.flowUnit,
      },
      {
        label: METRIC_TEXT.pressure,
        value: formatMetric(day.P_night, STATION_DISPLAY.pressureDigits, this.locale),
        unit: day.P_night === null ? METRIC_FORMAT.empty : METRIC_TEXT.pressureUnit,
      },
    ];
    if (!this.compact())
      metrics.push(
        {
          label: METRIC_TEXT.baseline,
          value: formatMetric(day.baseline, STATION_DISPLAY.flowDigits, this.locale),
          unit: day.baseline === null ? METRIC_FORMAT.empty : METRIC_TEXT.flowUnit,
        },
        {
          label: METRIC_TEXT.deviation,
          value: formatMetric(day.dev_pct, STATION_DISPLAY.flowDigits, this.locale, true),
          unit: day.dev_pct === null ? METRIC_FORMAT.empty : METRIC_TEXT.percentUnit,
        },
      );
    return metrics;
  });
}
