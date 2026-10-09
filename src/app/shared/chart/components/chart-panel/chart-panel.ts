import { PANEL_TEXT } from '../../config/panel-text.config';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChartSpec } from '../../types/chart.interfaces';
import { LineChart } from '../line-chart/line-chart';

@Component({
  selector: 'app-chart-panel',
  imports: [LineChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-panel.html',
  styleUrl: './chart-panel.scss',
})
export class ChartPanel {
  readonly text = PANEL_TEXT;
  readonly spec = input.required<ChartSpec>();
  readonly expandLabel = computed(() => this.text.expand + this.spec().title);
  readonly expand = output<ChartSpec>();
}
