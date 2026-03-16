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

// PATCH to set additional document price
router.patch(
  "/additional-documents/:id/price",
  requireAuth,
  requireRole("rmo"),
  rmoController.SetAdditionalDocumentPrice
);

module.exports = router;
