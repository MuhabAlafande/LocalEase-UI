export interface IService {
  id: string;
  displayName: string;
  description: string;
  categoryId: string;
  price: string;
  isActive: boolean;
  createdAt: Date;
  createdByUserId: string;
}
