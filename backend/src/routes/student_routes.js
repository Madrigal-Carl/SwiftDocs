const requireRole = require("../middlewares/role");
const requireAuth = require("../middlewares/auth");
const requireGuest = require("../middlewares/guest");
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");
const { validateCreateStudent } = require("../validators/student_validator");

// Request documents
router.post(
  "/",
  requireGuest,
  validateCreateStudent,
  studentController.CreateStudentRequest,
);

// Fetch all students requested documents
router.get(
  "/",
  requireAuth,
  requireRole("admin", "rmo"),
  studentController.GetAllStudentsRequests,
);

// Fetch a student's requested documents
router.get(
  "/:id",
  requireAuth,
  requireRole("rmo", "cashier", "admin"),
  studentController.GetStudentRequest,
);

module.exports = router;
