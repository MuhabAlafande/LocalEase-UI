import { Component, inject, input, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BookingStatus } from '../../../shared/models/BookingStatus';
import { IBooking } from '../../../shared/models/IBooking';
import { AuthService } from '../../../shared/services/auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { IUser } from '../../../shared/models/IUser';

@Component({
  selector: 'app-provider-bookings',
  imports: [Button, TableModule],
  templateUrl: './provider-bookings.component.html',
  styleUrl: './provider-bookings.component.css',
})
export class ProviderBookingsComponent {
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  protected readonly BookingStatus = BookingStatus;
  bookings = input.required<IBooking[]>();
  user = signal<IUser | null>(null);

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.usersService.getUserById(userId).subscribe((user) => {
          this.user.set(user);
        });
      }
    });
  }
}
