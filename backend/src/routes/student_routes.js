const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");
const { validateCreateStudent } = require("../validators/student_validator");

// Create a new student with education, record, request, documents
router.post("/", validateCreateStudent, studentController.CreateStudentRequest);

module.exports = router;
