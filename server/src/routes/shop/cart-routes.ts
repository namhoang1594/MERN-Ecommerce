import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart,
} from "../../controllers/shop/cart-controller";
import { verifyToken } from "../../middlewares/auth/auth";

const router = Router();

router.use(verifyToken);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.post("/merge", mergeCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
