import { Component, input, output } from '@angular/core';
import { IService } from '../../../shared/models/IService';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-service-card',
  imports: [CurrencyPipe],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent {
  service = input.required<IService>();
  serviceClick = output<string>();

  onServiceClick() {
    this.serviceClick.emit(this.service().id);
  }
}
