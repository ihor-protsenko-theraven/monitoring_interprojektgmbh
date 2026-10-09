import { StationMetrics } from '../station-metrics/station-metrics';
import { HUB_TEXT } from '../../config/hub-text.config';
import { ROUTE_URLS } from '../../../../core/config/navigation.config';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationsStore } from '../../data/stations.store';
import { STATUS, STATION_CSS, STATION_DISPLAY, STATION_STATUS } from '../../config/stations.config';
import { formatDate } from '../../../../shared/utils/date.utils';
import { StationsMap } from '../stations-map/stations-map';

@Component({
  selector: 'app-stations-hub',
  imports: [RouterLink, StationsMap, StationMetrics],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stations-hub.html',
  styleUrl: './stations-hub.scss',
})
export class StationsHub {
  readonly text = HUB_TEXT;
  readonly routes = ROUTE_URLS;
  readonly store = inject(StationsStore);
  readonly display = STATION_DISPLAY;
  readonly referenceDate = computed(() => formatDate(this.store.stations()[0].today.date));
  readonly cards = computed(() =>
    this.store.stations().map((station) => {
      const status = STATUS[station.today.status];
      return {
        ...station,
        statusLabel: status.label,
        statusClass: STATION_CSS.stationStatus + status.css,
        cardClass: STATION_CSS.stationCard + status.css,
      };
    }),
  );
  readonly summary = computed(() => {
    const stations = this.store.stations();
    return {
      total: stations.length,
      normal: stations.filter((s) => s.today.status === STATION_STATUS.normal).length,
      attention: stations.filter(
        (s) => s.today.status === STATION_STATUS.alarm || s.today.status === STATION_STATUS.warning,
      ).length,
      outage: stations.filter((s) => s.today.status === STATION_STATUS.outage).length,
      unknown: stations.filter((s) => s.today.status === STATION_STATUS.unknown).length,
    };
  });
}
