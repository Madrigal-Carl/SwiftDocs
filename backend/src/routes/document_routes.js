const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

// create document
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  documentController.CreateDocument
);

// update document
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  documentController.UpdateDocument
);

// soft delete document
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  documentController.DeleteDocument
);

module.exports = router;