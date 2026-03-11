const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");
const { validateCreateStudent } = require("../validators/student_validator");

// Request documents
router.post("/", validateCreateStudent, studentController.CreateStudentRequest);

// Fetch a student's requested documents
router.get("/:id", studentController.GetStudentRequest);

// Fetch all students requested documents
router.get("/", studentController.GetAllStudentsRequests);

module.exports = router;
