import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';

export const MainRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'service-details/:id',
    loadComponent: () =>
      import('../service-details/service-details.component').then(
        (c) => c.ServiceDetailsComponent,
      ),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('../profile/profile.component').then((c) => c.ProfileComponent),
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('../bookings-list/bookings-list.component').then(
        (c) => c.BookingsListComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../provider-home/provider-home.component').then(
        (c) => c.ProviderHomeComponent,
      ),
  },
];
