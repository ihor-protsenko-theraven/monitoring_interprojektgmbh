import type { LatLngTuple, PointTuple } from 'leaflet';

export const MAP_CONFIG = {
  stylesPath: 'assets/leaflet/leaflet.css',
  stylesError: 'Unable to load map styles',
  center: [50.266, 28.665] as LatLngTuple,
  zoom: 12,
  scrollWheelZoom: true,
  maxZoom: 19,
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  markerRadius: 12,
  markerWeight: 2,
  markerFillOpacity: 0.95,
  boundsPadding: [40, 40] as PointTuple,
  tooltipSeparator: ' · ',
} as const;
