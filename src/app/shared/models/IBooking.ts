import { BookingStatus } from './BookingStatus';

export interface IBooking {
  id: string;
  bookerId: string;
  serviceId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
}
