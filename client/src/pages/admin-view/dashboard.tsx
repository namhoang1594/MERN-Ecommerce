import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImages, getFeatureImages } from "@/store/common-slice";
import { AppDispatch, RootState } from "@/store/store";
import { FeatureImage } from "../../store/common-slice/common.types";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { featureImageList } = useSelector(
    (state: RootState) => state.commonFeature
  );

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImages(uploadedImageUrl)).then((data) => {
      if (data?.payload) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={false}
      />

      <Button onClick={handleUploadFeatureImage}>Upload</Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.length > 0 &&
          featureImageList.map((featureImg: FeatureImage) => (
            <div key={featureImg._id}>
              <img
                src={featureImg.image}
                alt=""
                className="w-full h-[300px] object-cover rounded-t-lg"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
