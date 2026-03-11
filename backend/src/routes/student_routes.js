const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");
const { validateCreateStudent } = require("../validators/student_validator");

// Fetch all students with a specific request status
router.get("/filter-by-status", studentController.GetStudentsByRequestStatus);

// Request documents
router.post("/", validateCreateStudent, studentController.CreateStudentRequest);

// Fetch all students requested documents
router.get("/", studentController.GetAllStudentsRequests);

// Fetch a student's requested documents
router.get("/:id", studentController.GetStudentRequest);

module.exports = router;
