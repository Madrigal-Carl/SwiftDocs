const express = require("express");
const router = express.Router();
const rmoController = require("../controllers/rmo_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const { validateUpdateRequestStatus } = require("../validators/rmo_validator");

// update request status
router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("rmo"),
  validateUpdateRequestStatus,
  rmoController.UpdateRequestStatus,
);

module.exports = router;
