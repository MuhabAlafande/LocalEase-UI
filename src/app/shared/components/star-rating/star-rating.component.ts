import { Component, input, model, output } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  imports: [PrimeTemplate, Rating, FormsModule],
  templateUrl: './star-rating-component.html',
  styleUrl: './star-rating.component.css',
})
export class StarRatingComponent {
  value = model<number>();
  readOnly = input<boolean>(false);

  changeValue = output<number>();

  ngOnInit() {
    this.value.subscribe((newValue) => this.onValueChange(newValue!));
  }

  onValueChange(value: number) {
    this.changeValue.emit(value);
  }
}
