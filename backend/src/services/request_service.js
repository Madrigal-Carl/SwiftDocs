const sequelize = require("../database/models").sequelize;
const studentRepository = require("../repositories/student_repository");
const educationRepository = require("../repositories/education_repository");
const requestRepository = require("../repositories/request_repository");
const documentRepository = require("../repositories/document_repository");
const mailService = require("./mail_service");

async function RequestDocuments(data) {
  return sequelize.transaction(async (t) => {
    const student = await studentRepository.CreateStudent(data, t);

    const educationData = {
      student_id: student.id,
      lrn: data.lrn,
      education_level: data.education_level,
      program: data.program, // unified field
      school_last_attended: data.school_last_attended,
      admission_date: data.admission_date,
      completion_status: data.completion_status,
      graduation_date: data.graduation_date || null,
      attendance_period: data.attendance_period || null,
    };
    await educationRepository.CreateEducation(educationData, t);

    const requestData = {
      student_id: student.id,
      request_date: new Date(),
      status: "pending",
      notes: data.notes,
    };
    const request = await requestRepository.CreateRequest(requestData, t);

    // 4️⃣ Create Documents
    if (Array.isArray(data.documents) && data.documents.length) {
      for (const doc of data.documents) {
        await documentRepository.CreateDocument(
          { request_id: request.id, type: doc.type, quantity: doc.quantity },
          t,
        );
      }
    }

    const requests = await studentRepository.FindStudentById(student.id, t, {
      include: [
        { association: "education" },
        { association: "request", include: ["documents"] },
      ],
    });

    return requests;
  });
}

async function SendRequestEmail(referenceNumber) {
  const request = await requestRepository.FindByReferenceNumber(
    referenceNumber,
    {
      include: ["student", "documents"],
    },
  );

  if (!request) {
    throw new Error("Request not found");
  }

  await mailService.SendMail({
    to: request.student.email,
    status: request.status,
    data: request,
  });

  return request;
}

async function GetRequestWithStudent(studentId) {
  const student = await studentRepository.FindStudentById(studentId, null, {
    include: [
      {
        association: "education",
      },
      { association: "request", include: ["documents"] },
    ],
  });

  return student;
}

async function GetAllRequestsWithStudent() {
  const students = await studentRepository.FindAllStudents(null, {
    include: [{ association: "request", include: ["documents"] }],
  });

  return students.map((s) => s.toJSON());
}

module.exports = {
  RequestDocuments,
  SendRequestEmail,
  GetRequestWithStudent,
  GetAllRequestsWithStudent,
};
