import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, averageRating, reviewCount }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Reseñas ({reviewCount})</h3>
      <div className="flex items-center space-x-2">
        <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))
          }
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500">Aún no hay reseñas para este producto.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{review.user.name}</CardTitle>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;