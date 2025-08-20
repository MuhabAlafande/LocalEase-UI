import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ServicesService } from '../shared/services/services.service';
import { AsyncPipe } from '@angular/common';
import { IService } from '../shared/models/IService';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home.component',
  imports: [FormsModule, AutoComplete, AsyncPipe, ServiceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly servicesService = inject(ServicesService);
  private readonly router = inject(Router);

  selectedService = signal<IService | undefined>(undefined);
  services = this.servicesService.getAllServices();

  filterServices(event: AutoCompleteCompleteEvent) {
    this.services = this.servicesService.filterServices(event.query);
  }

  onSelectService(event: AutoCompleteSelectEvent) {
    this.services = this.servicesService.filterServices(
      event.value.displayName,
    );
  }

  onServiceClick(serviceId: string) {
    this.router.navigate(['service-details', serviceId]);
  }
}
