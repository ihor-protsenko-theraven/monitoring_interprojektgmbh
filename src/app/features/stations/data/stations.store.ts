import { Injectable, signal } from '@angular/core';
import { computeDays } from '../utils/station-calculations';
import { Station } from '../types/station.interfaces';
import { STATIONS_META } from '../config/stations.config';
import { STATIONS_RAW } from './stations.mock';

@Injectable()
export class StationsStore {
  private readonly state = signal<readonly Station[]>(
    STATIONS_META.map((meta) => {
      const days = computeDays(STATIONS_RAW[meta.id]);
      return { meta, days, today: days[days.length - 1] };
    }),
  );
  readonly stations = this.state.asReadonly();
}
