import { Component, inject, input, signal } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { ServicesCategoriesService } from '../shared/services/services-categories.service';
import { IServiceCategory } from '../shared/models/IServiceCategory';
import { IUser } from '../shared/models/IUser';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../shared/components/star-rating/star-rating.component';
import { ActivatedRoute } from '@angular/router';
import { ReviewsService } from '../shared/services/reviews.service';
import { IReview } from '../service-details/components/add-review-dialog/models/IReview';
import { ReviewCardComponent } from './components/review-card.component';
import { UserType } from '../shared/models/UserType';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [FormsModule, StarRatingComponent, ReviewCardComponent],
})
export class ProfileComponent {
  private readonly usersService = inject(UsersService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );
  private readonly reviewsService = inject(ReviewsService);
  private readonly route = inject(ActivatedRoute);

  user = signal<IUser | null>(null);
  servicesCategory = signal<IServiceCategory | null>(null);
  reviews = signal<IReview[]>([]);
  userId = input<string>();
  withInfo = input<boolean>(true);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.usersService
        .getUserById(this.userId() ?? params.get('id')!)
        .subscribe(async (user) => {
          if (user !== null) {
            this.user.set(user);
            if (user.userType === UserType.ServiceProvider) {
              this.servicesCategoriesService
                .getCategoryById(user.serviceCategory)
                .subscribe((category) => this.servicesCategory.set(category));

              this.reviewsService
                .getUserReviews(user.id)
                .subscribe((reviews) => this.reviews.set(reviews));
            }
          }
        });
    });
  }

  protected readonly UserType = UserType;
}
