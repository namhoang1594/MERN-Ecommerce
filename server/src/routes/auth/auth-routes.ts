import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser
} from "../../controllers/auth/auth-controllers";
import { verifyToken } from "../../middlewares/auth/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshUser);
router.post("/logout", verifyToken, logoutUser);

export default router; 
