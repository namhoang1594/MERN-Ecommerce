const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleWare,
} = require("../../controllers/auth/auth-controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleWare, (req, res) => {
  const user = req.user;
  res.status(201).json({
    success: true,
    message: "Authenticated user!",
  });
});

module.exports = router;
