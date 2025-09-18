import { clearCart, clearLocalCart } from "@/store/shop/cart-slice";
import { CartItem, LocalCartItem } from "@/store/shop/cart-slice/cart.types";
import { AppDispatch } from "@/store/store";

export const getProductInfo = (item: CartItem | LocalCartItem, isLoggedIn: boolean) => {
    if (!isLoggedIn) {
        // Local cart item
        const localItem = item as LocalCartItem;
        return {
            id: localItem.productId,
            title: localItem.product.title,
            image: localItem.product.image[0]?.url,
            price: localItem.product.price,
            salePrice: localItem.product.salePrice,
            totalStock: localItem.product.totalStock,
            displayPrice: localItem.product.salePrice || localItem.product.price
        };
    } else {
        // Server cart item
        const serverItem = item as CartItem;
        if (typeof serverItem.productId === 'string') {
            return null; // Should not happen if populated correctly
        }
        const product = serverItem.productId;
        return {
            id: product._id,
            title: product.title,
            image: product.image[0]?.url,
            price: product.price,
            salePrice: product.salePrice,
            totalStock: product.totalStock,
            displayPrice: product.salePrice || product.price
        };
    }
};

// Get cart items
export const getCartItems = (isLoggedIn: boolean, serverCart: any, localCart: any[]) => {
    return isLoggedIn ? serverCart?.items || [] : localCart || [];
};

// Calculate totals
export const calculateTotals = (items: any[], isLoggedIn: boolean) => {
    return items.reduce((acc, item) => {
        const productInfo = getProductInfo(item, isLoggedIn);
        if (productInfo) {
            acc.totalPrice += item.quantity * productInfo.displayPrice;
            acc.totalItems += item.quantity;
        }
        return acc;
    }, { totalPrice: 0, totalItems: 0 });
};

// Hàm reset cart sau khi checkout thành công
export const resetCartAfterCheckout = (dispatch: AppDispatch) => {
    dispatch(clearCart());       // clear Redux store
    clearLocalCart();            // clear LocalStorage
};