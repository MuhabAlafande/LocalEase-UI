import { IPlace } from '../models/IPlace';
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
export class PlacesService {
  constructor(private readonly firestore: Firestore) {}

  getAllPlaces(): Observable<IPlace[]> {
    const promise = getDocs(collection(this.firestore, 'places')).then((qs) =>
      qs.docs.map((doc) => doc.data() as IPlace),
    );
    return from(promise);
  }

  filterPlaces(filterText: string): Observable<IPlace[]> {
    const result = this.getAllPlaces().pipe(
      map((places) =>
        places.filter((place) =>
          place.name.toLowerCase().includes(filterText.toLowerCase()),
        ),
      ),
    );

    return from(result);
  }

  async getPlaceByName(name: string) {
    const q = query(
      collection(this.firestore, 'places'),
      where('name', '==', name),
      limit(1),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0].data() as IPlace;
  }

  getPlaceById(placeId: string) {
    const ref = doc(this.firestore, 'places', placeId);
    const promise = getDoc(ref).then((docSnap) => {
      return docSnap.exists() ? (docSnap.data() as IPlace) : null;
    });
    return from(promise);
  }
}
