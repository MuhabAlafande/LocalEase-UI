import { UserType } from './UserType';

export interface IUser {
  id: string;
  email: string;
  username: string;
  phone: string;
  location: string;
  userType: UserType;
  serviceCategory: string;
  profileImageUrl?: string;
  rating?: number;
}
