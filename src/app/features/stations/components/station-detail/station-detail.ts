import { stationDayView } from '../../utils/station-presentation.utils';
import { StationMetrics } from '../station-metrics/station-metrics';
import { DETAIL_TEXT } from '../../config/detail-text.config';
import type { SelectedPeriod } from '../../types/station.interfaces';
import { ROUTE_URLS } from '../../../../core/config/navigation.config';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  LOCALE_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationsStore } from '../../data/stations.store';
import type { StatusFilter, PeriodField } from '../../types/station.types';
import {
  STATUS,
  STATION_CSS,
  STATION_RULES,
  STATION_STATUS,
  ALL_STATUSES,
  STATUS_FILTERS,
  STATION_DISPLAY,
} from '../../config/stations.config';
import { monthlyBaseline } from '../../utils/station-calculations';
import { addDays, formatDate } from '../../../../shared/utils/date.utils';
import { dailyCharts, monthlyChart } from '../../utils/chart.utils';
import { ChartSpec } from '../../../../shared/chart/types/chart.interfaces';
import { ChartPanel } from '../../../../shared/chart/components/chart-panel/chart-panel';
import { ChartDialog } from '../../../../shared/chart/components/chart-dialog/chart-dialog';

@Component({
  selector: 'app-station-detail',
  imports: [RouterLink, ChartPanel, ChartDialog, StationMetrics],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './station-detail.html',
  styleUrl: './station-detail.scss',
})
export class StationDetail {
  private readonly locale = inject(LOCALE_ID);
  readonly text = DETAIL_TEXT;
  readonly routes = ROUTE_URLS;
  readonly id = input.required<string>();
  private readonly store = inject(StationsStore);
  readonly station = computed(() => this.store.stations().find((s) => s.meta.id === this.id()));
  private readonly selectedPeriod = signal<SelectedPeriod | null>(null);
  readonly period = computed(() => {
    const station = this.station();
    const selected = this.selectedPeriod();
    if (selected?.id === this.id()) return selected;
    return {
      from: station ? addDays(station.today.date, -(STATION_RULES.defaultPeriodDays - 1)) : '',
      to: station?.today.date ?? '',
    };
  });
  readonly invalidPeriod = computed(
    () => !this.period().from || !this.period().to || this.period().from > this.period().to,
  );
  readonly filtered = computed(() =>
    this.invalidPeriod()
      ? []
      : (this.station()?.days.filter(
          (d) => d.date >= this.period().from && d.date <= this.period().to,
        ) ?? []),
  );
  readonly filter = signal<StatusFilter>(ALL_STATUSES);
  readonly alerts = computed(() =>
    this.filtered()
      .filter(
        (d) =>
          d.status !== STATION_STATUS.normal &&
          (this.filter() === ALL_STATUSES || d.status === this.filter()),
      )
      .reverse(),
  );
  readonly daily = computed(() => dailyCharts(this.filtered()));
  readonly monthly = computed(() => {
    const station = this.station();
    return monthlyChart(
      station ? monthlyBaseline(station.days, station.today.date) : { labels: [], values: [] },
    );
  });
  readonly fullscreen = signal<ChartSpec | null>(null);
  // Derive the open chart from the current filter so it never shows stale data.
  readonly activeChart = computed(() => {
    const open = this.fullscreen();
    return open
      ? ([...this.daily(), this.monthly()].find((s) => s.key === open.key) ?? null)
      : null;
  });
  readonly stationView = computed(() => {
    const station = this.station();
    if (!station) return undefined;
    const status = STATUS[station.today.status];
    return {
      ...station,
      dateLabel: formatDate(station.today.date),
      statusLabel: status.label,
      statusClass: STATION_CSS.detailStatus + status.css,
    };
  });
  readonly tableRows = computed(() =>
    this.filtered().map((day) => stationDayView(day, this.locale)),
  );
  readonly alertRows = computed(() => {
    const dates = new Set(this.alerts().map((day) => day.date));
    return this.tableRows()
      .filter((day) => dates.has(day.date))
      .reverse();
  });
  readonly filters = STATUS_FILTERS;
  readonly filterOptions = computed(() =>
    this.filters.map((item) => ({ ...item, active: this.filter() === item.value })),
  );
  readonly display = STATION_DISPLAY;
  setDate(key: PeriodField, value: string): void {
    this.selectedPeriod.set({ ...this.period(), id: this.id(), [key]: value });
  }
}
