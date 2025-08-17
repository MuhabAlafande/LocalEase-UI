import { IUser } from '../models/IUser';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { PlacesService } from './places.service';
import { ServicesCategoriesService } from './services-categories.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly placesService = inject(PlacesService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
  ) {}
  async saveUser(user: IUser) {
    const place = await this.placesService.getPlaceByName(user.location);
    user.location = place.id;

    if (user.serviceCategory !== '') {
      const serviceCategory =
        await this.servicesCategoriesService.getServiceCategoryByName(
          user.serviceCategory,
        );
      user.serviceCategory = serviceCategory.id;
    }

    const ref = doc(this.firestore, 'users', this.auth.currentUser!.uid);
    return setDoc(ref, user);
  }
}
