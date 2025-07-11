const express = require("express");
const router = express.Router();

const {
  getAllOrdersOfAllUser,
  getOrderDetailsAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

router.get("/get", getAllOrdersOfAllUser);
router.get("/details/:id", getOrderDetailsAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
