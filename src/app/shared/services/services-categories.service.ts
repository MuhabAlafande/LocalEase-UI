import { IServiceCategory } from '../models/IServiceCategory';
import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesCategoriesService {
  constructor(private readonly firestore: Firestore) {}

  getAllServicesCategories(): Observable<IServiceCategory[]> {
    const promise = getDocs(
      collection(this.firestore, 'servicesCategories'),
    ).then((qs) => qs.docs.map((doc) => doc.data() as IServiceCategory));

    return from(promise);
  }

  filterServicesCategories(filterText: string): Observable<IServiceCategory[]> {
    const result = this.getAllServicesCategories().pipe(
      map((categories) =>
        categories.filter((category) =>
          category.name.toLowerCase().includes(filterText.toLowerCase()),
        ),
      ),
    );

    return from(result);
  }

  async getServiceCategoryByName(name: string) {
    const q = query(
      collection(this.firestore, 'servicesCategories'),
      where('name', '==', name),
      limit(1),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0].data() as IServiceCategory;
  }

  getCategoryById(categoryId: string) {
    const ref = doc(this.firestore, 'servicesCategories', categoryId);
    const promise = getDoc(ref).then((docSnap) => {
      return docSnap.exists() ? (docSnap.data() as IServiceCategory) : null;
    });
    return from(promise);
  }
}
