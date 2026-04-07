const express = require("express");
const router = express.Router();
const rmoController = require("../controllers/rmo_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const {
  validateUpdateRequestStatus,
  validateUpdateAdditionalDocuments,
} = require("../validators/rmo_validator");
const { userLimiter } = require("../middlewares/rate_limiter");

// update additional document prices
router.patch(
  "/requests/:id/additional-documents",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  validateUpdateAdditionalDocuments,
  rmoController.UpdateAdditionalDocumentPrices,
);

// update request status
router.patch(
  "/requests/:id/status",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  validateUpdateRequestStatus,
  rmoController.UpdateRequestStatus,
);

module.exports = router;
