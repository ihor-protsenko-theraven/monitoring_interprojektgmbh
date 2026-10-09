import { CHART_KEYS, CHART_STYLE, CHART_OPTIONS } from '../../../shared/chart/config/chart.config';
import { DATE_FORMAT } from '../../../shared/config/date.config';
import { THEME_COLORS } from '../../../shared/config/theme.config';
import { CHART_TITLES, CHART_LABELS } from '../config/charts.config';
import { STATION_RULES } from '../config/stations.config';
import type { MonthlyBaseline } from '../types/station.interfaces';
import type { ChartDataset, ChartOptions } from 'chart.js';
import type { ChartSpec } from '../../../shared/chart/types/chart.interfaces';
import { DayRecord } from '../types/station.interfaces';
import { formatDate } from '../../../shared/utils/date.utils';

const line = (
  label: string,
  data: (number | null)[],
  color: string,
  extra: Partial<ChartDataset<'line'>> = {},
): ChartDataset<'line'> => ({
  label,
  data,
  borderColor: color,
  backgroundColor: color,
  borderWidth: CHART_STYLE.borderWidth,
  pointRadius: CHART_STYLE.pointRadius,
  spanGaps: false,
  tension: CHART_STYLE.tension,
  ...extra,
});
function options(): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: CHART_OPTIONS.interactionMode, intersect: false },
    plugins: {
      legend: {
        labels: {
          color: THEME_COLORS['text-muted'],
          font: { size: CHART_STYLE.legendFontSize },
          boxWidth: CHART_STYLE.legendBoxWidth,
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: { color: THEME_COLORS['border'] },
        ticks: {
          color: THEME_COLORS['text-muted'],
          autoSkip: true,
          maxRotation: CHART_STYLE.maxRotation,
          maxTicksLimit: CHART_STYLE.maxTicks,
        },
      },
      y: {
        grid: { color: THEME_COLORS['border'] },
        ticks: { color: THEME_COLORS['text-muted'] },
        title: { display: true, text: CHART_LABELS.flowUnit, color: THEME_COLORS['text-muted'] },
      },
    },
  };
}
export function dailyCharts(days: readonly DayRecord[]): readonly ChartSpec[] {
  const labels = days.map((d) => formatDate(d.date).slice(0, DATE_FORMAT.shortDateLength));
  const devOptions = options();
  devOptions.scales![CHART_OPTIONS.axes.flow] = {
    min: CHART_STYLE.deviationMin,
    max: CHART_STYLE.deviationMax,
    grid: { color: THEME_COLORS['border'] },
    ticks: {
      color: THEME_COLORS['text-muted'],
      callback: (v) => `${Number(v) > 0 ? '+' : ''}${v}%`,
    },
  };
  const pressureOptions = options();
  pressureOptions.scales![CHART_OPTIONS.axes.pressure] = {
    position: CHART_OPTIONS.pressurePosition,
    grid: { drawOnChartArea: false },
    ticks: { color: THEME_COLORS['text-muted'] },
    title: { display: true, text: CHART_LABELS.pressureUnit, color: THEME_COLORS['text-muted'] },
  };
  const colors = days.map((d) =>
    d.dev_pct === null
      ? THEME_COLORS['transparent']
      : Math.abs(d.dev_pct) > STATION_RULES.alarmPercent
        ? THEME_COLORS['danger']
        : Math.abs(d.dev_pct) > STATION_RULES.warningPercent
          ? THEME_COLORS['deviation-warning']
          : THEME_COLORS['success'],
  );
  return [
    {
      key: CHART_KEYS.deviation,
      title: CHART_TITLES.devPct,
      config: {
        type: CHART_OPTIONS.type,
        data: {
          labels,
          datasets: [
            line(
              CHART_LABELS.deviation,
              days.map((d) => d.dev_pct),
              THEME_COLORS['success'],
              {
                pointRadius: CHART_STYLE.deviationPointRadius,
                pointBackgroundColor: colors,
                pointBorderColor: colors,
              },
            ),
            line(
              CHART_LABELS.upperWarning,
              days.map(() => STATION_RULES.warningPercent),
              THEME_COLORS['warning'],
            ),
            line(
              CHART_LABELS.upperAlarm,
              days.map(() => STATION_RULES.alarmPercent),
              THEME_COLORS['danger'],
            ),
          ],
        },
        options: devOptions,
      },
    },
    {
      key: CHART_KEYS.absolute,
      title: CHART_TITLES.abs,
      config: {
        type: CHART_OPTIONS.type,
        data: {
          labels,
          datasets: [
            line(
              CHART_LABELS.flow,
              days.map((d) => d.Q_night),
              THEME_COLORS['flow'],
            ),
            line(
              CHART_LABELS.baseline,
              days.map((d) => d.baseline),
              THEME_COLORS['accent'],
              { borderWidth: CHART_STYLE.baselineWidth },
            ),
            line(
              CHART_LABELS.warning,
              days.map((d) => d.threshold_warn),
              THEME_COLORS['warning'],
            ),
            line(
              CHART_LABELS.alarm,
              days.map((d) => d.threshold_alarm),
              THEME_COLORS['danger'],
            ),
          ],
        },
        options: options(),
      },
    },
    {
      key: CHART_KEYS.flowPressure,
      title: CHART_TITLES.flowPressure,
      config: {
        type: CHART_OPTIONS.type,
        data: {
          labels,
          datasets: [
            line(
              CHART_LABELS.flowPressure,
              days.map((d) => d.Q_night),
              THEME_COLORS['flow'],
              { yAxisID: CHART_OPTIONS.axes.flow },
            ),
            line(
              CHART_LABELS.pressure,
              days.map((d) => d.P_night),
              THEME_COLORS['accent'],
              { yAxisID: CHART_OPTIONS.axes.pressure },
            ),
          ],
        },
        options: pressureOptions,
      },
    },
  ];
}
export function monthlyChart(monthly: MonthlyBaseline): ChartSpec {
  return {
    key: CHART_KEYS.monthlyBaseline,
    title: CHART_TITLES.monthlyBaseline,
    description: CHART_LABELS.monthlyDescription,
    config: {
      type: CHART_OPTIONS.type,
      data: {
        labels: monthly.labels,
        datasets: [
          line(CHART_LABELS.monthlyBaseline, monthly.values, THEME_COLORS['accent'], {
            borderWidth: CHART_STYLE.baselineWidth,
            pointRadius: CHART_STYLE.monthlyPointRadius,
          }),
        ],
      },
      options: options(),
    },
  };
}
