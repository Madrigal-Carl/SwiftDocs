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

router.post(
  "/register",
  // requireGuest,
  requireAuth,
  requireRole("admin", "rmo", "cashier"),
  validateRegister,
  authController.register,
);

router.post("/login", requireGuest, validateLogin, authController.login);

router.post(
  "/logout",
  requireAuth,
  requireRole("admin", "rmo", "cashier"),
  authController.logout,
);

module.exports = router;
