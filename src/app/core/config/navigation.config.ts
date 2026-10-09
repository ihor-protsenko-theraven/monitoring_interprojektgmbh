export const ROUTE_PATHS = {
  login: 'login',
  stations: 'stations',
  stationId: ':id',
} as const;

export const ROUTE_URLS = {
  login: `/${ROUTE_PATHS.login}`,
  stations: `/${ROUTE_PATHS.stations}`,
} as const;
