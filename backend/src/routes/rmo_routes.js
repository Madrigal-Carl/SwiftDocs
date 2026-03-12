const express = require("express");
const router = express.Router();
const rmoController = require("../controllers/rmo_controller");
const requireAuth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("rmo"),
  rmoController.UpdateRequestStatus
);

module.exports = router;