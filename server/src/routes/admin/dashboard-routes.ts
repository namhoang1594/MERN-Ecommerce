import { Router } from "express";
import { getDashboardStatsController, } from "../../controllers/admin/dashboard-controller";

const router = Router();

router.get("/", getDashboardStatsController);


export default router;
