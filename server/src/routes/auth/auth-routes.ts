import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
} from "../../controllers/auth/auth-controllers";
import { authMiddleware } from "../../middlewares/auth/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, checkAuth);

export default router; 
