import { IUser } from './IUser';

export interface IMessage {
  id: string;
  conversationId: string;
  body: string;
  createdAt: Date;
  senderUser: IUser;
  receiverUser: IUser;
}
