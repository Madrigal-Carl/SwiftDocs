const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const { validateUpdateAccount } = require("../validators/account_validator");

// Get all accounts
router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  accountController.getAllAccounts,
);

// Get user stats
router.get(
  "/analytics",
  requireAuth,
  requireRole("admin"),
  accountController.getUserStats,
);

// Get specific account by ID
router.get(
  "/:id",
  requireAuth,
  requireRole("admin"),
  accountController.getAccount,
);

// Update specific account by ID
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validateUpdateAccount,
  accountController.updateAccount,
);

module.exports = router;
