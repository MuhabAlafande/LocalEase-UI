import { Component, inject, input, signal } from '@angular/core';
import { ReviewCardComponent } from '../../../profile/components/review-card.component';
import { IReview } from '../../../service-details/components/add-review-dialog/models/IReview';
import { UsersService } from '../../../shared/services/users.service';
import { IUser } from '../../../shared/models/IUser';

@Component({
  selector: 'app-reviews-list',
  imports: [ReviewCardComponent],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.css',
})
export class ReviewsListComponent {
  private readonly usersService = inject(UsersService);
  reviews = input.required<IReview[]>();
  reviewer = signal<IUser | null>(null);

  nngOnInit() {
    this.reviews().forEach((review) => {
      this.usersService.getUserById(review.reviewerId).subscribe((user) => {
        this.reviewer.set(user);
      });
    });
  }
}
