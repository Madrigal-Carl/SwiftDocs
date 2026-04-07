const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const allowGuestOrRMO = require("../middlewares/allow_guest_or_rmo");
const {
  validateCreateDocument,
  validateUpdateDocument,
} = require("../validators/document_validator");
const { userLimiter } = require("../middlewares/rate_limiter");

// fetch document analytics
router.get(
  "/analytics",
  requireAuth,
  userLimiter,
  requireRole("admin", "rmo"),
  documentController.GetDocumentAnalytics,
);

// fetch all documents without pagination
router.get(
  "/all",
  allowGuestOrRMO,
  documentController.GetAllDocumentsNoPagination,
);

// fetch all documents
router.get(
  "/",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  documentController.GetAllDocuments,
);

// fetch document by id
router.get(
  "/:id",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  documentController.GetDocumentById,
);

// create document
router.post(
  "/",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  validateCreateDocument,
  documentController.CreateDocument,
);

// update document
router.patch(
  "/:id",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  validateUpdateDocument,
  documentController.UpdateDocument,
);

// soft delete document
router.delete(
  "/:id",
  requireAuth,
  userLimiter,
  requireRole("rmo"),
  documentController.DeleteDocument,
);

module.exports = router;
