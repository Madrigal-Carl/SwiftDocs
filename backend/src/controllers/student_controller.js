const studentService = require("../services/student_service");

async function CreateStudentRequest(req, res) {
  const student = await studentService.CreateStudent(req.body);
  res.status(201).json(student);
}

module.exports = { CreateStudentRequest };
