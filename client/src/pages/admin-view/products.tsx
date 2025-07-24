// src/pages/admin-view/products.tsx
import { Fragment, useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import ProductImageUpload from "../../components/admin-view/image-upload";
import AdminProductTile from "../../components/admin-view/product-tile";
import CommonForm from "../../components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/admin/products-slice";
import { addProductFormElements } from "../../config/index";
import { Product } from "../../types/products/product.types";
import { AppDispatch, RootState } from "../../store/store";

interface ProductFormData {
  image: string | null;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  salePrice: string;
  totalStock: string;
}

const initialFormData: ProductFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const dispatch = useDispatch<AppDispatch>();

  const [createProducts, setCreateProducts] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const { productList } = useSelector(
    (state: RootState) => state.adminProducts
  );

  const handleSetFormData = (product: Product) => {
    setFormData({
      image: product.image,
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      salePrice: product.salePrice.toString(),
      totalStock: product.totalStock?.toString() ?? "0",
    });
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function isFormValid(): boolean {
    return Object.values(formData).every((value) => value !== "");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if ((data as any)?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setCreateProducts(false);
          setCurrentEditedId(null);
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if ((data as any)?.payload?.success) {
          dispatch(fetchAllProducts());
          setCreateProducts(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast.success("Product Add Successfully!");
        }
      });
    }
  }

  function handleDeleteProduct(productId: string) {
    dispatch(deleteProduct(productId)).then((data) => {
      if ((data as any)?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  return (
    <Fragment>
      <div className="flex justify-end w-full mb-5">
        <Button onClick={() => setCreateProducts(true)}>Add New Product</Button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productList?.length > 0 &&
          productList.map((productItem: Product, index: number) => (
            <AdminProductTile
              key={index}
              product={productItem}
              setCurrentEditedId={setCurrentEditedId}
              setCreateProducts={setCreateProducts}
              setFormData={handleSetFormData}
              handleDeleteProduct={handleDeleteProduct}
            />
          ))}
      </div>
      <Sheet
        open={createProducts}
        onOpenChange={() => {
          setCreateProducts(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="p-3">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
