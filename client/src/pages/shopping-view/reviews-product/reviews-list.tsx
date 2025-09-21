import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { deleteReview, fetchReviews } from "@/store/shop/review-product-slice";

interface ReviewListProps {
  productId: string;
  currentUserId?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  currentUserId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading } = useSelector(
    (state: RootState) => state.shopReviewProduct
  );

  useEffect(() => {
    dispatch(fetchReviews({ productId }));
  }, [dispatch, productId]);

  if (loading) return <p>Đang tải đánh giá...</p>;

  console.log("Current User ID:", currentUserId);

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p>Chưa có đánh giá nào</p>}

      {reviews.map((review) => (
        <div
          key={review._id}
          className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start"
        >
          <div>
            <p className="font-semibold">{review.user?.name}</p>
            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
            {review.comment && <p className="mt-1">{review.comment}</p>}
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {currentUserId === review.user._id && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dispatch(deleteReview(review._id))}
            >
              Xoá
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
