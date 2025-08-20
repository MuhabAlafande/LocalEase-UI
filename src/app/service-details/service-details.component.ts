import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../shared/services/services.service';
import { IService } from '../shared/models/IService';
import { IUser } from '../shared/models/IUser';
import { UsersService } from '../shared/services/users.service';
import { ServicesCategoriesService } from '../shared/services/services-categories.service';
import { IServiceCategory } from '../shared/models/IServiceCategory';
import { Button } from 'primeng/button';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { PlacesService } from '../shared/services/places.service';
import { IPlace } from '../shared/models/IPlace';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-service-details',
  imports: [Button, CurrencyPipe, AsyncPipe],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
})
export class ServiceDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly servicesService = inject(ServicesService);
  private readonly usersService = inject(UsersService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );
  private readonly placesService = inject(PlacesService);
  private readonly authService = inject(AuthService);
  serviceId!: string;
  service = signal<IService | null>(null);
  user = signal<IUser | null>(null);
  serviceCategory = signal<IServiceCategory | null>(null);
  place = signal<IPlace | null>(null);
  nearbyPlaces = signal<IPlace[]>([]);
  isLoggedIn = this.authService.isLoggedIn();

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.serviceId = params.get('id')!;

      this.servicesService
        .getServiceById(this.serviceId)
        .subscribe((service) => {
          if (service !== null) {
            this.service.set(service);
            this.getUser(service.createdByUserId);
            this.getServiceCategory(service.categoryId);
          }
        });
    });
  }

  getUser(userId: string) {
    this.usersService.getUserById(userId).subscribe((user) => {
      if (user !== null) {
        this.user.set(user);
        this.getPlace(user.location);
      }
    });
  }

  getPlace(placeId: string) {
    this.placesService.getPlaceById(placeId).subscribe((place) => {
      if (place !== null) {
        this.place.set(place);

        this.getNearbyPlaces(place);
      }
    });
  }

  getServiceCategory(categoryId: string) {
    return this.servicesCategoriesService
      .getCategoryById(categoryId)
      .subscribe((category) => {
        if (category !== null) this.serviceCategory.set(category);
      });
  }

  getNearbyPlaces(place: IPlace) {
    place.nearbyPlaces.forEach((place) => {
      this.placesService.getPlaceById(place).subscribe((nearbyPlace) => {
        if (nearbyPlace !== null) {
          this.nearbyPlaces.update((places) => [...places, nearbyPlace]);
        }
      });
    });
  }
}
