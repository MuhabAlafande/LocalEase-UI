import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { IService } from '../models/IService';
import { from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  constructor(private readonly firestore: Firestore) {}

  getAllServices() {
    const promise = getDocs(collection(this.firestore, 'services')).then((qs) =>
      qs.docs.map((doc) => doc.data() as IService),
    );

    return from(promise);
  }

  filterServices(filterText: string) {
    const result = this.getAllServices().pipe(
      map((services) =>
        services.filter((service) =>
          service.displayName.toLowerCase().includes(filterText.toLowerCase()),
        ),
      ),
    );

    return from(result);
  }

  getServiceById(serviceId: string) {
    const ref = doc(this.firestore, 'services', serviceId);
    const promise = getDoc(ref).then((docSnap) => {
      return docSnap.exists() ? (docSnap.data() as IService) : null;
    });
    return from(promise);
  }
}
