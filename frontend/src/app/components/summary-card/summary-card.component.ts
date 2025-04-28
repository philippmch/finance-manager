import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() amount: number = 0;
  @Input() isPositive: boolean = true;
}
