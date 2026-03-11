const sequelize = require("../database/models").sequelize;
const studentRepository = require("../repositories/student_repository");
const educationRepository = require("../repositories/education_repository");
const collegeRecordRepository = require("../repositories/college_record_repository");
const shRecordRepository = require("../repositories/senior_high_record_repository");
const requestRepository = require("../repositories/request_repository");
const documentRepository = require("../repositories/document_repository");

async function RequestDocuments(data) {
  return sequelize.transaction(async (t) => {
    // 1️⃣ Create Student
    const student = await studentRepository.CreateStudent(data, t);

    // 2️⃣ Create Education
    const educationData = {
      student_id: student.id,
      lrn: data.lrn,
      education_level: data.education_level,
      school_last_attended: data.school_last_attended,
      admission_date: data.admission_date,
      completion_status: data.completion_status,
      graduation_date: data.graduation_date || null,
      attendance_period: data.attendance_period || null,
    };
    const education = await educationRepository.CreateEducation(
      educationData,
      t,
    );

    // 3️⃣ Create CollegeRecord or SeniorHighRecord
    if (data.education_level === "college") {
      await collegeRecordRepository.CreateCollegeRecord(
        { education_id: education.id, course: data.course },
        t,
      );
    } else {
      await shRecordRepository.CreateSeniorHighRecord(
        { education_id: education.id, track: data.track },
        t,
      );
    }

    // 4️⃣ Create Request
    const requestData = {
      student_id: student.id,
      request_date: new Date(),
      status: "pending",
      notes: data.notes,
    };
    const request = await requestRepository.CreateRequest(requestData, t);

    // 5️⃣ Create Documents
    if (Array.isArray(data.documents) && data.documents.length) {
      for (const doc of data.documents) {
        await documentRepository.CreateDocument(
          { request_id: request.id, type: doc.type, quantity: doc.quantity },
          t,
        );
      }
    }

    // 6️⃣ Reload student with associations
    const fullStudent = await studentRepository.FindStudentById(student.id, t, {
      include: [
        {
          association: "education",
          include: ["collegeRecord", "seniorHighRecord"],
        },
        { association: "request", include: ["documents"] },
      ],
    });

    return fullStudent;
  });
}

async function GetStudentWithRequest(studentId) {
  const student = await studentRepository.FindStudentById(studentId, null, {
    include: [
      {
        association: "education",
        include: ["collegeRecord", "seniorHighRecord"],
      },
      { association: "request", include: ["documents"] },
    ],
  });

  if (!student) return null;
  const studentJSON = student.toJSON();
  if (student.education) {
    const record = await student.education.getRecord();
    const { collegeRecord, seniorHighRecord, ...eduFields } =
      studentJSON.education;
    studentJSON.education = {
      ...eduFields,
      record: record || null,
    };
  }

  return studentJSON;
}

module.exports = {
  RequestDocuments,
  GetStudentWithRequest,
};
