import { Component, inject, input } from '@angular/core';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { Textarea } from 'primeng/textarea';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReviewsService } from '../../../shared/services/reviews.service';

@Component({
  selector: 'app-add-review-dialog',
  imports: [
    StarRatingComponent,
    Textarea,
    FormsModule,
    Button,
    ReactiveFormsModule,
  ],
  templateUrl: './add-review-dialog.component.html',
  styleUrl: './add-review-dialog.component.css',
})
export class AddReviewDialogComponent {
  private readonly reviewsService = inject(ReviewsService);
  private readonly formBuilder = inject(FormBuilder);
  serviceId = input.required<string>();
  ratingForm!: FormGroup;
  dialogRef = inject(DynamicDialogRef);

  ngOnInit() {
    this.ratingForm = this.formBuilder.group({
      rating: [0, Validators.required],
      comment: ['', Validators.required],
    });
  }

  onRatingChange(rating: number) {
    this.ratingForm.get('rating')?.setValue(rating);
  }

  async submitReview() {
    if (this.ratingForm.invalid) {
      this.ratingForm.markAllAsDirty();
      return;
    }

    await this.reviewsService
      .addReview(this.serviceId(), this.ratingForm.value)
      .then(() => this.dialogRef.close('ok'));
  }
}
