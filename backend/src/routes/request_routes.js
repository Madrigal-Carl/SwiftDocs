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

// Fetch all requests requested documents
router.get(
  "/",
  requireAuth,
  requireRole("admin", "rmo"),
  requestController.GetAllRequestsWithStudent,
);

// Fetch a request's requested documents
router.get(
  "/:id",
  requireAuth,
  requireRole("rmo", "cashier", "admin"),
  requestController.GetRequest,
);

module.exports = router;
