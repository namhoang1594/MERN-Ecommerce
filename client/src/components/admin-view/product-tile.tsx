import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Product } from "../../types/products/product.types";

type AdminProductTileProps = {
  product: Product;
  setCurrentEditedId: (id: string) => void;
  setCreateProducts: (value: boolean) => void;
  setFormData: (product: Product) => void;
  handleDeleteProduct: (id: string) => void;
};

function AdminProductTile({
  product,
  setCurrentEditedId,
  setCreateProducts,
  setFormData,
  handleDeleteProduct,
}: AdminProductTileProps) {
  return (
    <Card>
      <div className="w-full max-w-sm mx-auto">
        <div className="relative">
          <img
            className="w-full h-[300px] object-cover rounded-t-lg"
            src={product?.image}
            alt={product.title}
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product.title}</h2>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`${
                product.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product.price}
            </span>
            {product.salePrice > 0 ? (
              <span className="text-lg font-bold">${product.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setCurrentEditedId(product._id);
              setCreateProducts(true);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDeleteProduct(product._id)}>
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
