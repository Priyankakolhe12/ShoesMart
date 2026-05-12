const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

// router.post("/admin-login", authController.adminLogin);

router.get("/get-me", authController.getMe);

router.get("/refresh-token", authController.refreshToken);

router.get("/logout", authController.logout);

router.get("/logout-all", authController.logoutAll);

router.post("/verify-email", authController.verifyEmail);
router.post("/resend-otp", authController.resendOTP);

module.exports = router;
