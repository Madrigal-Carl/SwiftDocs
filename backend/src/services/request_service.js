const { sequelize, Request } = require("../database/models");
const studentRepository = require("../repositories/student_repository");
const educationRepository = require("../repositories/education_repository");
const requestRepository = require("../repositories/request_repository");
const requestedDocumentRepository = require("../repositories/requested_document_repository");
const documentRepository = require("../repositories/document_repository");
const additionalDocumentRepository = require("../repositories/additional_document_repository");
const mailService = require("./mail_service");
const { computeStats } = require("../utils/stats_computation");

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
  referenceNumber = referenceNumber.trim().toLowerCase();
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

async function GetAllRequestsWithStudent(page = 1, limit = 10) {
  const { docs, pages, total } =
    await requestRepository.FetchAllRequestsWithStudent(page, limit);

  const result = docs.map((req) => {
    const student = req.student;

    const totalDocuments =
      req.getTotalDocumentQuantity() + req.getTotalAdditionalQuantity();

    const totalPrice = req.getGrandTotal();

    return {
      id: student.id,
      full_name: student.getFullName(),
      lrn: student.education?.lrn,
      request: {
        id: req.id,
        reference_number: req.reference_number,
        request_date: req.request_date,
        status: req.status,
        total_documents: totalDocuments,
        total_price: totalPrice,
      },
    };
  });

  return {
    data: result,
    pagination: {
      total,
      pages,
      page,
      limit,
    },
  };
}

async function GetRequestAnalytics() {
  const requests = await requestRepository.GetAllRequestStatuses();

  const stats = computeStats(requests);

  return stats;
}

module.exports = {
  RequestDocuments,
  SendRequestEmail,
  GetRequestWithStudent,
  GetAllRequestsWithStudent,
  GetRequestAnalytics,
};
