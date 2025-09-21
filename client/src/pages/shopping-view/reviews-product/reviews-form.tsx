import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { createReview, updateReview } from "@/store/shop/review-product-slice";
import Form from "@/components/common/form";
import { reviewsFormControls } from "@/config";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    _id: string;
    rating: number;
    comment?: string;
  };
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.shopReviewProduct);
  const [defaultValues, setDefaultValues] = useState({
    rating: String(existingReview?.rating || 5),
    comment: existingReview?.comment || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setDefaultValues({
        rating: String(existingReview.rating),
        comment: existingReview.comment || "",
      });
    }
  }, [existingReview]);

  const handleSubmit = async (values: Record<string, string>) => {
    const rating = parseInt(values.rating);
    const comment = values.comment.trim() || undefined;

    if (rating < 1 || rating > 5) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (existingReview) {
        await dispatch(
          updateReview({
            id: existingReview._id,
            rating,
            comment,
          })
        ).unwrap();
      } else {
        await dispatch(
          createReview({
            productId,
            rating,
            comment,
          })
        ).unwrap();

        // Reset form after create
        setDefaultValues({
          rating: "5",
          comment: "",
        });
      }
      toast.success(
        existingReview
          ? "Cập nhập đánh giá thành công"
          : "Gửi đánh giá thành công"
      );
      onSuccess?.();
    } catch (error) {
      toast.error("Review submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <Form
        controls={reviewsFormControls}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitText={existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        loading={isSubmitting}
      />
    </div>
  );
};

export default ReviewForm;
