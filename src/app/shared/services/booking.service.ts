import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { IBooking } from '../models/IBooking';
import { Observable } from 'rxjs';
import { BookingStatus } from '../models/BookingStatus';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly firestore = inject(Firestore);

  getUserBookings(userId: string): Observable<IBooking[]> {
    const q = query(
      collection(this.firestore, 'bookings'),
      where('bookerId', '==', userId),
    );

    return new Observable<IBooking[]>((observer) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookings: IBooking[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const booking: IBooking = {
            id: doc.id,
            bookerId: data['bookerId'],
            serviceId: data['serviceId'],
            startDate: data['startDate'].toDate(),
            endDate: data['endDate'].toDate(),
            status: data['status'],
          };
          bookings.push(booking);
        });
        observer.next(bookings);
      });

      return () => unsubscribe();
    });
  }

  async addBooking(booking: {
    serviceId: string;
    bookerId: string;
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
  }): Promise<void> {
    await addDoc(collection(this.firestore, 'bookings'), booking);
  }
}
