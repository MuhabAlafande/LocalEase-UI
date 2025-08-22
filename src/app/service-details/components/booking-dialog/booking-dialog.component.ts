import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-booking-dialog',
  imports: [FormsModule, DatePicker, Button],
  templateUrl: './booking-dialog.component.html',
  styleUrl: './booking-dialog.component.css',
})
export class BookingDialogComponent {
  selectedDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date(Date.now() + 1000 * 60 * 60); // Default to 1 hour later
  dialogRef = inject(DynamicDialogRef);

  onBookClick() {
    // Combine the selected date with start and end times
    const startDateTime = this.combineDateTime(this.selectedDate, this.startTime);
    const endDateTime = this.combineDateTime(this.selectedDate, this.endTime);

    this.dialogRef.close({
      status: 'ok',
      data: {
        startDate: startDateTime,
        endDate: endDateTime,
      },
    });
  }

  private combineDateTime(date: Date, time: Date): Date {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  }
}
