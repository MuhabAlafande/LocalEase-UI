import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { AuthService } from '../shared/services/auth.service';
import { ServicesCategoriesService } from '../shared/services/services-categories.service';
import { IServiceCategory } from '../shared/models/IServiceCategory';
import { IUser } from '../shared/models/IUser';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { UserType } from '../shared/models/UserType';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [Rating, FormsModule, PrimeTemplate],
})
export class ProfileComponent {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );

  user = signal<IUser | null>(null);
  servicesCategory = signal<IServiceCategory | null>(null);

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId !== undefined) {
        this.usersService.getUserById(userId).subscribe((user) => {
          if (user !== null) {
            this.user.set(user);
            this.servicesCategoriesService
              .getCategoryById(user.serviceCategory)
              .subscribe((category) => this.servicesCategory.set(category));
          }
        });
      }
    });
  }

  protected readonly UserType = UserType;
}
