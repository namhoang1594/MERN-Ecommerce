import { Router } from "express";
import { verifyToken } from "../../middlewares/auth/auth";
import { changePassword, getProfile, updateProfile } from "../../controllers/shop/user-profile-controller";
import { addAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from "../../controllers/shop/address-controller";


const router = Router();

router.use(verifyToken);

// User profile routes
router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/change-password", changePassword);

// Adress routes
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.put("/addresses/:id/set-default", setDefaultAddress);
router.delete("/addresses/:id", deleteAddress);

export default router;
