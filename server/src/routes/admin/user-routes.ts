import { Router } from "express";
import { deleteUser, getAllUsers, updateUserRole, updateUserStatus } from "../../controllers/admin/user-controller";
import { requireAdmin, verifyToken } from "../../middlewares/auth/auth";


const router = Router();

router.use(verifyToken, requireAdmin);

router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.put("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

export default router;
