import {
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { ServicesCategoriesService } from '../../../shared/services/services-categories.service';
import { ServicesService } from '../../../shared/services/services.service';
import { IBooking } from '../../../shared/models/IBooking';
import { IService } from '../../../shared/models/IService';
import { IServiceCategory } from '../../../shared/models/IServiceCategory';
import { IUser } from '../../../shared/models/IUser';
import { Button } from 'primeng/button';
import {
  AddReviewDialogComponent
} from '../../../service-details/components/add-review-dialog/add-review-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-booking-card',
  imports: [Button],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css',
})
export class BookingCardComponent {
  private readonly usersService = inject(UsersService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );
  private readonly servicesService = inject(ServicesService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  isReviewDisabled = input.required<boolean>();
  booking = input.required<IBooking>();
  service = signal<IService | null>(null);
  serviceProvider = signal<IUser | null>(null);
  serviceCategory = signal<IServiceCategory | null>(null);

  ngOnInit() {
    this.servicesService
      .getServiceById(this.booking().serviceId)
      .subscribe((service) => {
        if (service != null) {
          this.service.set(service);

          this.usersService
            .getUserById(service.createdByUserId)
            .subscribe((user) => this.serviceProvider.set(user));

          this.servicesCategoriesService
            .getCategoryById(service.categoryId)
            .subscribe((category) => {
              this.serviceCategory.set(category);
            });
        }
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
}
