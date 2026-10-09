import { MAP_TEXT } from '../../config/map-text.config';
import { THEME_COLORS } from '../../../../shared/config/theme.config';
import { MAP_CONFIG } from '../../config/map.config';
import { ROUTE_URLS } from '../../../../core/config/navigation.config';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet/dist/leaflet-src.esm.js';
import { Station } from '../../types/station.interfaces';
import { STATUS } from '../../config/stations.config';
import { MapStylesService } from '../../data/map-styles.service';

@Component({
  selector: 'app-stations-map',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stations-map.html',
  styleUrl: './stations-map.scss',
})
export class StationsMap {
  readonly text = MAP_TEXT;
  readonly routes = ROUTE_URLS;
  readonly stations = input.required<readonly Station[]>();
  readonly tileError = signal(false);
  readonly stylesError = signal(false);
  private readonly styles = inject(MapStylesService);
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('mapHost');
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(async () => {
      try {
        await this.styles.load();
      } catch {
        if (!this.destroyRef.destroyed) this.stylesError.set(true);
        return;
      }
      if (this.destroyRef.destroyed) return;
      const map = L.map(this.host().nativeElement, {
        scrollWheelZoom: MAP_CONFIG.scrollWheelZoom,
      }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
      L.tileLayer(MAP_CONFIG.tileUrl, {
        attribution: MAP_CONFIG.attribution,
        maxZoom: MAP_CONFIG.maxZoom,
      })
        .on('tileerror', () => this.tileError.set(true))
        .addTo(map);
      const bounds: L.LatLngTuple[] = [];
      for (const station of this.stations()) {
        const point: L.LatLngTuple = [station.meta.lat, station.meta.lng];
        bounds.push(point);
        L.circleMarker(point, {
          radius: MAP_CONFIG.markerRadius,
          color: THEME_COLORS['surface-raised'],
          weight: MAP_CONFIG.markerWeight,
          fillColor: STATUS[station.today.status].color,
          fillOpacity: MAP_CONFIG.markerFillOpacity,
        })
          .bindTooltip(
            station.meta.name + MAP_CONFIG.tooltipSeparator + STATUS[station.today.status].label,
          )
          .on('click', () => void this.router.navigate([ROUTE_URLS.stations, station.meta.id]))
          .addTo(map);
      }
      map.fitBounds(bounds, { padding: MAP_CONFIG.boundsPadding });
      const resize = new ResizeObserver(() => map.invalidateSize());
      resize.observe(this.host().nativeElement);
      this.destroyRef.onDestroy(() => {
        resize.disconnect();
        map.remove();
      });
    });
  }
}
