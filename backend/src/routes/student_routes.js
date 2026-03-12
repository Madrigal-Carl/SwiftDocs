const requireRole = require("../middlewares/role");
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");
const { validateCreateStudent } = require("../validators/student_validator");

// Request documents
router.post("/", validateCreateStudent, studentController.CreateStudentRequest);

// Fetch all students requested documents
router.get(
  "/",
  requireRole("admin", "rmo"),
  studentController.GetAllStudentsRequests,
);

// Fetch a student's requested documents
router.get(
  "/:id",
  requireRole("rmo", "cashier", "admin"),
  studentController.GetStudentRequest,
);

module.exports = router;
