import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../shared/services/booking.service';
import { AuthService } from '../shared/services/auth.service';
import { IBooking } from '../shared/models/IBooking';
import { BookingCardComponent } from './components/booking-card/booking-card.component';
import { ReviewsService } from '../shared/services/reviews.service';
import { IReview } from '../service-details/components/add-review-dialog/models/IReview';
import { BookingStatus } from '../shared/models/BookingStatus';

@Component({
  selector: 'app-bookings-list',
  imports: [BookingCardComponent],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.css',
})
export class BookingsListComponent {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly reviewsService = inject(ReviewsService);

  bookings = signal<IBooking[]>([]);
  userReviews = signal<IReview[]>([]);

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId !== undefined) {
        this.bookingService
          .getUserBookings(userId)
          .subscribe((bookings) => this.bookings.set(bookings));

        this.reviewsService
          .getUserReviews(userId)
          .subscribe((reviews) => this.userReviews.set(reviews));
      }
    });
  }

  isReviewExist(serviceId: string) {
    return (
      this.userReviews().filter((review) => review.serviceId === serviceId)
        .length > 0
    );
  }

  protected readonly BookingStatus = BookingStatus;
}
