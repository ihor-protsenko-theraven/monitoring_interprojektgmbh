import { CHART_STYLE } from '../../config/chart.config';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

@Component({
  selector: 'app-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart {
  readonly config = input.required<ChartConfiguration<'line'>>();
  readonly label = input.required<string>();
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart<'line'>;
  constructor() {
    afterRenderEffect(() => {
      const config = this.config();
      const data = structuredClone(config.data);
      if (this.chart) {
        this.chart.data = data;
        this.chart.options = config.options ?? {};
        this.chart.update(CHART_STYLE.updateMode);
      } else this.chart = new Chart(this.canvas().nativeElement, { ...config, data });
    });
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }
}
