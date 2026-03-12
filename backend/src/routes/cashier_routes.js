const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");

router.get(
  "/students",
  requireRole("cashier"),
  cashierController.GetStudentsForCashier,
);

module.exports = router;
