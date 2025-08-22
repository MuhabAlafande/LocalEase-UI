import { Routes } from '@angular/router';
import { MainLayoutWrapperComponent } from './main-layout/main-layout-wrapper.component';
import { MainRoutes } from './main-layout/main-layout.routes';
import { DialogService } from 'primeng/dynamicdialog';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutWrapperComponent,
    providers: [DialogService],
    children: [...MainRoutes],
  },
  {
    path: 'authentication/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'authentication/register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
];
