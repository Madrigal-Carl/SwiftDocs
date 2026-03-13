const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const {
  validateUpdateRequestStatus,
} = require("../validators/cashier_validator");

<<<<<<< HEAD
//get requests with invoiced and paid requests status for cashier
=======
// get students with invoiced and paid requests status for cashier
>>>>>>> main
router.get(
  "/requests",
  requireAuth,
  requireRole("cashier"),
<<<<<<< HEAD
  cashierController.GetRequestsForCashier,
=======
  cashierController.GetStudentsForCashier
>>>>>>> main
);

// update request status
router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("cashier"),
  validateUpdateRequestStatus,
<<<<<<< HEAD
  cashierController.UpdateRequestStatus,
=======
  cashierController.UpdateRequestStatus
>>>>>>> main
);

module.exports = router;