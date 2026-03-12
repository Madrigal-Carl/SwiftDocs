const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");

router.get(
  "/students",
  requireAuth,
  requireRole("cashier"),
  cashierController.GetStudentsForCashier,
);
router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("cashier"),
  cashierController.UpdateRequestStatus
);
module.exports = router;
