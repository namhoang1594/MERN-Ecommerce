import express from "express";
import { getDashboardStatsController, } from "../../controllers/admin/dashboard-controller";

const router = express.Router();

router.get("/", getDashboardStatsController);


export default router;
