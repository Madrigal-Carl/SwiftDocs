const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const {
  validateCreateDocument,
  validateUpdateDocument,
} = require("../validators/document_validator");

// fetch document analytics
router.get(
  "/analytics",
  requireAuth,
  requireRole("admin"),
  documentController.GetDocumentAnalytics,
);

// fetch all documents without pagination
router.get(
  "/all",
  requireAuth,
  requireRole("rmo"),
  documentController.GetAllDocumentsNoPagination,
);

// fetch all documents
router.get(
  "/",
  requireAuth,
  requireRole("rmo"),
  documentController.GetAllDocuments,
);

// fetch document by id
router.get(
  "/:id",
  requireAuth,
  requireRole("rmo"),
  documentController.GetDocumentById,
);

// create document
router.post(
  "/",
  requireAuth,
  requireRole("rmo"),
  validateCreateDocument,
  documentController.CreateDocument,
);

// update document
router.patch(
  "/:id",
  requireAuth,
  requireRole("rmo"),
  validateUpdateDocument,
  documentController.UpdateDocument,
);

// soft delete document
router.delete(
  "/:id",
  requireAuth,
  requireRole("rmo"),
  documentController.DeleteDocument,
);

module.exports = router;
