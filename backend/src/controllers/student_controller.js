const studentService = require("../services/student_service");

async function CreateStudentRequest(req, res) {
  const io = req.app.get("io");
  const student = await studentService.RequestDocuments(req.body);

  io.emit("studentsUpdated", { status: student.request?.status || null });

  res.status(201).json(student);
}

async function GetStudentRequest(req, res) {
  const student = await studentService.GetStudentWithRequest(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
}

async function GetAllStudentsRequests(req, res) {
  const students = await studentService.GetAllStudentsWithRequests();

  res.json(students);
}

module.exports = {
  CreateStudentRequest,
  GetStudentRequest,
  GetAllStudentsRequests,
};
