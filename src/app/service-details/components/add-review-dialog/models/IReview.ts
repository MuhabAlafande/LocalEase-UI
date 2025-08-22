export interface IReview {
  id: string;
  serviceId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
