import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DialogService } from 'primeng/dynamicdialog';
import { AddReviewDialogComponent } from './components/add-review-dialog/add-review-dialog.component';
import { ReviewsService } from '../shared/services/reviews.service';
import { BookingService } from '../shared/services/booking.service';
import { BookingStatus } from '../shared/models/BookingStatus';
import { BookingDialogComponent } from './components/booking-dialog/booking-dialog.component';
import { MessagingService } from '../shared/services/messaging.service';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';

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
  private readonly dialogService = inject(DialogService);
  private readonly reviewsService = inject(ReviewsService);
  private readonly bookingService = inject(BookingService);
  private readonly messagingService = inject(MessagingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  service = signal<IService | null>(null);
  providerUser = signal<IUser | null>(null);
  currentUserId = signal<string | undefined>(undefined);
  serviceCategory = signal<IServiceCategory | null>(null);
  place = signal<IPlace | null>(null);
  nearbyPlaces = signal<IPlace[]>([]);
  isLoggedIn = this.authService.isLoggedIn();
  isReviewDisabled = signal<boolean>(true);
  isBookingDisabled = signal<boolean>(true);
  isProvider = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.servicesService
        .getServiceById(params.get('id')!)
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
        this.providerUser.set(user);
        this.getPlace(user.location);

        this.authService.getCurrentUserId().subscribe((id) => {
          if (id !== undefined) {
            this.isProvider.set(this.providerUser()?.id === id);
            this.currentUserId.set(id);
            this.setIsReviewDisabled();
            this.setIsBookDisabled();
          }
        });
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

  setIsReviewDisabled() {
    this.reviewsService
      .getUserReviews(this.currentUserId()!)
      .subscribe((reviews) => {
        this.bookingService
          .getUserBookings(this.currentUserId()!)
          .subscribe((bookings) => {
            console.log(bookings);
            console.log(reviews);
            this.isReviewDisabled.set(
              reviews.length === 0 ||
                bookings.length === 0 ||
                reviews.some(
                  (review) => review.serviceId === this.service()?.id,
                ) ||
                bookings.some(
                  (booking) =>
                    booking.serviceId !== this.service()?.id ||
                    booking.status !== BookingStatus.Completed,
                ),
            );
          });
      });
  }

  setIsBookDisabled() {
    this.bookingService
      .getUserBookings(this.currentUserId()!)
      .subscribe((bookings) => {
        this.isBookingDisabled.set(
          bookings.some((booking) => booking.serviceId === this.service()?.id),
        );
      });
  }

  openReviewDialog() {
    const dialog = this.dialogService.open(AddReviewDialogComponent, {
      header: 'Add Review',
      inputValues: { serviceId: this.service()?.id },
      styleClass: 'dialog-md',
      focusOnShow: false,
      closable: true,
      modal: true,
    });

    this.destroyRef.onDestroy(() => dialog.close());
  }

  openBookingDialog() {
    const dialog = this.dialogService.open(BookingDialogComponent, {
      header: 'Book Service',
      styleClass: 'dialog-md',
      focusOnShow: false,
      closable: true,
      modal: true,
    });

    dialog.onClose.subscribe(async (result) => {
      if (result && result.status === 'ok') {
        await this.bookService({
          serviceId: this.service()!.id,
          bookerId: this.currentUserId()!,
          startDate: result.data.startDate,
          endDate: result.data.endDate,
          status: BookingStatus.InProgress,
        });
      }
    });

    this.destroyRef.onDestroy(() => dialog.close());
  }

  async openChatDialog() {
    const conversationId = await this.messagingService.createConversation(
      this.service()?.id!,
      this.currentUserId()!,
    );

    this.dialogService.open(ChatDialogComponent, {
      header: 'Conversation',
      inputValues: {
        serviceId: this.service()?.id,
        conversationId,
        providerUser: this.providerUser(),
        currentUserId: this.currentUserId(),
      },
      styleClass: 'dialog-lg',
      focusOnShow: false,
      closable: true,
      modal: true,
    });
  }

  private async bookService(booking: {
    serviceId: string;
    bookerId: string;
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
  }) {
    await this.bookingService.addBooking(booking);
  }

  navigateToProviderInfo() {
    this.router.navigate(['profile', this.providerUser()?.id!]);
  }
}
