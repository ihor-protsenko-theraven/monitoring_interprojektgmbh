import { DIALOG_TEXT } from '../../config/dialog-text.config';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ChartSpec } from '../../types/chart.interfaces';
import { LineChart } from '../line-chart/line-chart';

@Component({
  selector: 'app-chart-dialog',
  imports: [LineChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-dialog.html',
  styleUrl: './chart-dialog.scss',
})
export class ChartDialog {
  readonly text = DIALOG_TEXT;
  readonly spec = input.required<ChartSpec>();
  readonly closed = output<void>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }
  cancel(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }
}
