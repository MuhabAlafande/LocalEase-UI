import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { IMessage } from '../models/IMessage';
import { Observable } from 'rxjs';
import { IConversation } from '../models/IConversation';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly firestore = inject(Firestore);

  async createConversation(serviceId: string, userId: string) {
    const q = query(
      collection(this.firestore, 'conversations'),
      where('serviceId', '==', serviceId),
      where('userId', '==', userId),
      limit(1),
    );

    const conversationsSnapshot = await getDocs(q);
    if (!conversationsSnapshot.empty) return conversationsSnapshot.docs[0].id;

    const ref = collection(this.firestore, 'conversations');
    const document = doc(ref);
    return await setDoc(document, {
      id: document.id,
      userId,
      createdAt: new Date(),
      serviceId,
    }).then(() => document.id);
  }

  getConversationsForService(serviceId: string): Observable<IConversation[]> {
    return new Observable<IConversation[]>((observer) => {
      const q = query(
        collection(this.firestore, 'conversations'),
        where('serviceId', '==', serviceId),
      );

      onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map((doc) => {
          return {
            id: doc.data()['id'],
            userId: doc.data()['userId'],
            createdAt: doc.data()['createdAt'].toDate(),
            serviceId: doc.data()['serviceId'],
          };
        });
        observer.next(conversations);
      });
    });
  }

  getConversationMessages(
    serviceId: string,
    userId: string,
  ): Observable<IMessage[]> {
    return new Observable<IMessage[]>((observer) => {
      const q = query(
        collection(this.firestore, 'conversations'),
        where('serviceId', '==', serviceId),
        where('userId', '==', userId),
        limit(1),
      );

      const unsubscribeConversation = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          observer.next([]);
          return;
        }

        const conversationId = snapshot.docs[0].id;
        const messagesRef = collection(
          this.firestore,
          'conversations',
          conversationId,
          'messages',
        );

        const unsubscribeMessages = onSnapshot(
          messagesRef,
          (messagesSnapshot) => {
            const messages = messagesSnapshot.docs
              .map((doc) => {
                return {
                  id: doc.data()['id'],
                  conversationId: doc.data()['conversationId'],
                  body: doc.data()['body'],
                  createdAt: doc.data()['createdAt'].toDate(),
                  senderUser: doc.data()['senderUser'],
                  receiverUser: doc.data()['receiverUser'],
                };
              })
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            observer.next(messages);
          },
        );

        observer.add(() => unsubscribeMessages());
      });

      return () => unsubscribeConversation();
    });
  }

  async sendMessage(message: Partial<IMessage>) {
    const ref = collection(
      this.firestore,
      'conversations',
      message.conversationId!,
      'messages',
    );

    const document = doc(ref);
    message.id = document.id;

    return await setDoc(document, message);
  }
}
