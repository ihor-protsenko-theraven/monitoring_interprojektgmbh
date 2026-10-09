import type { ChartConfiguration } from 'chart.js';

import type { ChartKey } from './chart.types';
export interface ChartSpec {
  readonly key: ChartKey;
  readonly title: string;
  readonly description?: string;
  readonly config: ChartConfiguration<'line'>;
}
