const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const {
  validateUpdateRequestStatus,
} = require("../validators/cashier_validator");
const upload = require("../middlewares/upload");

//get requests with invoiced and paid requests status for cashier
router.get(
  "/requests",
  requireAuth,
  requireRole("cashier"),
  cashierController.GetRequestsForCashier,
);

// update request status
router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("cashier"),
  (req, res, next) => {
    upload.array("proofs", 3)(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message:
            err.code === "LIMIT_UNEXPECTED_FILE"
              ? "Maximum of 3 proof images allowed"
              : err.message,
        });
      }
      next();
    });
  },
  validateUpdateRequestStatus,
  cashierController.UpdateRequestStatus,
);

module.exports = router;
