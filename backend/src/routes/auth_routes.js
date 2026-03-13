const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth_controller");
const requireAuth = require("../middlewares/auth");
const requireGuest = require("../middlewares/guest");
const requireRole = require("../middlewares/role");

const {
  validateRegister,
  validateLogin,
} = require("../validators/auth_validator");

// Register
router.post(
  "/register",
  // requireGuest,
  requireAuth,
  requireRole("admin", "rmo", "cashier"),
  validateRegister,
  authController.register,
);

// Login
router.post("/login", requireGuest, validateLogin, authController.login);

// Logout
router.post(
  "/logout",
  requireAuth,
  requireRole("admin", "rmo", "cashier"),
  authController.logout,
);

// Get current authenticated user
router.get("/me", requireAuth, authController.me);

module.exports = router;
