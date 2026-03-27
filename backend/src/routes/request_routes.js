const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const requireGuest = require("../middlewares/guest");
const allowGuestOrRMO = require("../middlewares/allow_guest_or_rmo");
const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request_controller");
const { validateCreateRequest } = require("../validators/request_validator");
const uploadRequirements = require("../middlewares/uploadRequirements");

// Request documents
router.post(
  "/",
  allowGuestOrRMO,
  uploadRequirements.array("requirements", 5),
  validateCreateRequest,
  requestController.CreateRequest,
);

// Request status update for requested documents
router.post(
  "/status/:referenceNumber/send-email",
  requireGuest,
  requestController.SendRequestEmail,
);

// Fetch all requests requested documents
router.get(
  "/",
  requireAuth,
  requireRole("admin", "rmo"),
  requestController.GetAllRequestsWithStudent,
);

// Dashboard stats for requests
router.get(
  "/analytics",
  requireAuth,
  requireRole("rmo", "cashier", "admin"),
  requestController.GetRequestAnalytics,
);

// Fetch a request's requested documents
router.get(
  "/:id",
  requireAuth,
  requireRole("rmo", "cashier", "admin"),
  requestController.GetRequest,
);

// Fetch a request by reference_number
router.get(
  "/reference/:referenceNumber",
  requireAuth,
  requireRole("rmo", "cashier", "admin"),
  requestController.GetRequestByReferenceNumber,
);

module.exports = router;
