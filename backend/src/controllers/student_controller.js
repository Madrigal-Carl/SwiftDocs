const studentService = require("../services/student_service");

async function CreateStudentRequest(req, res) {
  const student = await studentService.RequestDocuments(req.body);
  res.status(201).json(student);
}

async function GetStudentRequest(req, res) {
  const student = await studentService.GetStudentWithRequest(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
}

module.exports = {
  CreateStudentRequest,
  GetStudentRequest,
};
