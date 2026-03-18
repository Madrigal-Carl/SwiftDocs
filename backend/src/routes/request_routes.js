const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const requireGuest = require("../middlewares/guest");
const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request_controller");
const { validateCreateRequest } = require("../validators/request_validator");

// Request documents
router.post(
  "/",
  requireGuest,
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

module.exports = router;
