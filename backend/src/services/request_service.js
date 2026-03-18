const sequelize = require("../database/models").sequelize;
const studentRepository = require("../repositories/student_repository");
const educationRepository = require("../repositories/education_repository");
const requestRepository = require("../repositories/request_repository");
const requestedDocumentRepository = require("../repositories/requested_document_repository");
const documentRepository = require("../repositories/document_repository");
const additionalDocumentRepository = require("../repositories/additional_document_repository");
const mailService = require("./mail_service");

async function RequestDocuments(data) {
  return sequelize.transaction(async (t) => {
    const student = await studentRepository.CreateStudent(data, t);

    const educationData = {
      student_id: student.id,
      lrn: data.lrn,
      education_level: data.education_level,
      program: data.program,
      school_last_attended: data.school_last_attended,
      admission_date: data.admission_date,
      completion_status: data.completion_status,
      graduation_date: data.graduation_date || null,
      attendance_period: data.attendance_period || null,
    };
    await educationRepository.CreateEducation(educationData, t);

    const requestData = {
      student_id: student.id,
      status: "pending",
      notes: data.notes,
    };
    const request = await requestRepository.CreateRequest(requestData, t);

    if (Array.isArray(data.documents) && data.documents.length) {
      await Promise.all(
        data.documents.map(async (doc) => {
          const document = await documentRepository.FindByType(
            doc.type.toLowerCase(),
            t,
          );

          if (!document) {
            throw new Error(`Document type "${doc.type}" not found`);
          }

          return requestedDocumentRepository.CreateRequestedDocument(
            {
              request_id: request.id,
              document_id: document.id,
              quantity: doc.quantity || 1,
            },
            t,
          );
        }),
      );
    }

    if (Array.isArray(data.additionals) && data.additionals.length) {
      for (const add of data.additionals) {
        await additionalDocumentRepository.CreateAdditionalDocument(
          {
            request_id: request.id,
            type: add.type,
            quantity: add.quantity || 1,
          },
          t,
        );
      }
    }

    return requestRepository.FindRequestById(request.id, t, {
      include: [
        {
          association: "student",
          include: [{ association: "education" }],
        },
        {
          association: "requested_documents",
          include: [{ association: "document" }],
        },
        {
          association: "additional_documents",
        },
      ],
    });
  });
}

async function SendRequestEmail(referenceNumber) {
  const request = await requestRepository.FindByReferenceNumber(
    referenceNumber,
    {
      include: [
        "student",
        {
          association: "requested_documents",
          include: ["document"],
        },
        {
          association: "additional_documents",
        },
      ],
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

async function GetRequestWithStudent(requestId) {
  const request = await requestRepository.FindRequestById(requestId, null, {
    include: [
      {
        association: "student",
        include: ["education"],
      },
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
  });

  return request;
}

async function GetAllRequestsWithStudent() {
  const students = await studentRepository.FindAllStudents(null, {
    include: [
      {
        association: "education",
        attributes: ["lrn"],
      },
      {
        association: "request",
        include: [
          {
            association: "requested_documents",
            include: ["document"],
          },
          {
            association: "additional_documents",
          },
        ],
      },
    ],
  });

  const result = students.map((s) => {
    const reqInstance = s.request;

    if (!reqInstance) {
      return {
        id: s.id,
        full_name: s.getFullName(),
        request: null,
      };
    }

    const totalDocuments =
      reqInstance.getTotalDocumentQuantity() +
      reqInstance.getTotalAdditionalQuantity();

    const totalPrice = reqInstance.getGrandTotal();

    return {
      id: s.id,
      full_name: s.getFullName(),
      lrn: s.education.lrn,
      request: {
        id: reqInstance.id,
        reference_number: reqInstance.reference_number,
        request_date: reqInstance.request_date,
        status: reqInstance.status,
        total_documents: totalDocuments,
        total_price: totalPrice,
      },
    };
  });

  return result.sort(
    (a, b) =>
      new Date(b.request.request_date) - new Date(a.request.request_date),
  );
}

module.exports = {
  RequestDocuments,
  SendRequestEmail,
  GetRequestWithStudent,
  GetAllRequestsWithStudent,
};
