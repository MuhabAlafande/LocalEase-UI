import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { IBooking } from '../shared/models/IBooking';
import { BookingStatus } from '../shared/models/BookingStatus';
import { ProviderBookingsComponent } from './components/provider-bookings/provider-bookings.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { IReview } from '../service-details/components/add-review-dialog/models/IReview';
import { ProfileComponent } from '../profile/profile.component';
import { AsyncPipe } from '@angular/common';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { MessagingService } from '../shared/services/messaging.service';
import { ServicesService } from '../shared/services/services.service';
import { map } from 'rxjs';
import { IMessage } from '../shared/models/IMessage';
import { IUser } from '../shared/models/IUser';
import { UsersService } from '../shared/services/users.service';
import { IConversation } from '../shared/models/IConversation';

@Component({
  selector: 'app-provider-home',
  imports: [
    TableModule,
    ProviderBookingsComponent,
    ReviewsListComponent,
    ProfileComponent,
    AsyncPipe,
    ChatsListComponent,
  ],
  templateUrl: './provider-home.component.html',
  styleUrl: './provider-home.component.css',
})
export class ProviderHomeComponent {
  private readonly authService = inject(AuthService);
  private readonly messagingService = inject(MessagingService);
  private readonly servicesService = inject(ServicesService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  selectedTab = signal('bookings');
  currentUserId$ = this.authService.getCurrentUserId();
  conversations = signal<
    Map<string, [conversation: IConversation, messages: IMessage[]]>
  >(new Map());
  providerUser = signal<IUser | null>(null);

  bookings: IBooking[] = [
    {
      id: '1',
      serviceId: '1',
      startDate: new Date('2023-10-01T10:00:00'),
      endDate: new Date('2023-10-01T11:00:00'),
      bookerId: '6',
      status: BookingStatus.InProgress,
    },
    {
      id: '2',
      serviceId: '2',
      startDate: new Date('2023-10-02T12:00:00'),
      endDate: new Date('2023-10-02T13:00:00'),
      bookerId: '7',
      status: BookingStatus.Booked,
    },
    {
      id: '3',
      serviceId: '3',
      startDate: new Date('2023-10-03T14:00:00'),
      endDate: new Date('2023-10-03T15:00:00'),
      bookerId: '8',
      status: BookingStatus.Completed,
    },
  ];

  reviews: IReview[] = [
    {
      id: '1',
      serviceId: '1',
      reviewerId: '6',
      rating: 5,
      comment: 'Great service!',
      createdAt: new Date('2023-09-15'),
    },
    {
      id: '2',
      serviceId: '2',
      reviewerId: '7',
      rating: 4,
      comment: 'Very good, but room for improvement.',
      createdAt: new Date('2023-09-16'),
    },
    {
      id: '3',
      serviceId: '3',
      reviewerId: '8',
      rating: 3,
      comment: 'Average experience.',
      createdAt: new Date('2023-09-17'),
    },
  ];

  ngOnInit() {
    this.currentUserId$.subscribe((userId) => {
      if (userId) {
        this.servicesService
          .getAllServices()
          .pipe(
            map((services) =>
              services.filter((service) => service.createdByUserId === userId),
            ),
          )
          .subscribe((services) => {
            services.forEach((service) => {
              this.messagingService
                .getConversationsForService(service.id)
                .subscribe((conversations) => {
                  conversations.forEach((conversation) => {
                    this.usersService
                      .getUserById(conversation.userId)
                      .subscribe((user) => this.providerUser.set(user));
                    this.messagingService
                      .getConversationMessages(service.id, conversation.userId)
                      .subscribe((messages) => {
                        this.conversations().set(conversation.id, [
                          conversation,
                          messages,
                        ]);
                      });
                  });
                });
            });
          });
      }
    });
  }

  onTabSelect(tab: string) {
    this.selectedTab.set(tab);
  }

  logout() {
    this.authService
      .signOut()
      .then(() => this.router.navigate(['authentication/login']));
  }
}
