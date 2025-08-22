import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { filter, Observable, take } from 'rxjs';
import { IReview } from '../../service-details/components/add-review-dialog/models/IReview';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);

  addReview(
    serviceId: string,
    reviewData: { rating: number; comment: string },
  ) {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .getCurrentUserId()
        .pipe(
          take(1),
          filter((userId) => !!userId),
        )
        .subscribe({
          next: async (userId) => {
            try {
              const review = {
                ...reviewData,
                reviewerId: userId!,
                serviceId: serviceId,
                createdAt: new Date(),
              };

              await addDoc(collection(this.firestore, 'reviews'), review);

              this.getUserReviews(userId!).subscribe(async (reviews) => {
                const rating =
                  reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                  reviews.length;

                await this.usersService.updateUserRating(userId!, rating);
                resolve();
              });
            } catch (error) {
              reject(error);
            }
          },
          error: reject,
        });
    });
  }

  getUserReviews(userId: string) {
    const q = query(
      collection(this.firestore, 'reviews'),
      where('reviewerId', '==', userId),
    );

    return new Observable<IReview[]>((observer) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookings: IReview[] = [];
        snapshot.docs.forEach((doc) => bookings.push(doc.data() as IReview));
        observer.next(bookings);
      });

      return () => unsubscribe();
    });
  }
}
