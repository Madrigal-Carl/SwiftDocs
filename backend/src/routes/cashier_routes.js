const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");

//get requests with invoiced and paid requests status for cashier
router.get(
  "/requests",
  requireAuth,
  requireRole("cashier"),
  cashierController.GetRequestsForCashier,
);

//update request status
router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("cashier"),
  cashierController.UpdateRequestStatus,
);

module.exports = router;
