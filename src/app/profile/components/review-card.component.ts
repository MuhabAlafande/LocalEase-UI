import { Component, input } from '@angular/core';
import { IReview } from '../../service-details/components/add-review-dialog/models/IReview';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-review-card',
  imports: [StarRatingComponent],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<IReview>();
  reviewerName = input.required<string>();
}
