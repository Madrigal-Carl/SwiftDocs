const express = require("express");
const router = express.Router();
const cashierController = require("../controllers/cashier_controller");
const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const {
  validateApprovePayment,
  validateUpdateToReview,
} = require("../validators/cashier_validator");
const upload = require("../middlewares/upload");
const { uploadLimiter, userLimiter } = require("../middlewares/rate_limiter");

//get requests with invoiced and paid requests status for cashier
router.get(
  "/requests",
  requireAuth,
  userLimiter,
  requireRole("cashier"),
  cashierController.GetRequestsForCashier,
);

// update request → UNDER REVIEW (no upload)
router.patch(
  "/requests/:id/review",
  requireAuth,
  userLimiter,
  requireRole("cashier"),
  validateUpdateToReview,
  cashierController.UpdateToReview,
);

// update request status
router.patch(
  "/requests/:id/approve-payment",
  requireAuth,
  uploadLimiter,
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
  validateApprovePayment,
  cashierController.ApprovePayment,
);

module.exports = router;
