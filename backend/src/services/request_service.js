const { sequelize } = require("../database/models");
const studentRepository = require("../repositories/student_repository");
const educationRepository = require("../repositories/education_repository");
const requestRepository = require("../repositories/request_repository");
const requestedDocumentRepository = require("../repositories/requested_document_repository");
const documentRepository = require("../repositories/document_repository");
const requirementRepository = require("../repositories/requirement_repository");
const additionalDocumentRepository = require("../repositories/additional_document_repository");
const mailService = require("./mail_service");
const { computeStats } = require("../utils/stats_computation");

async function RequestDocuments(data, files = []) {
  const result = await sequelize.transaction(async (t) => {
    const student = await studentRepository.CreateStudent(data, t);

    await educationRepository.CreateEducation(
      {
        student_id: student.id,
        lrn: data.lrn,
        education_level: data.education_level,
        program: data.program,
        school_last_attended: data.school_last_attended,
        admission_date: data.admission_date,
        completion_status: data.completion_status,
        graduation_date: data.graduation_date || null,
        attendance_period: data.attendance_period || null,
      },
      t,
    );

    const request = await requestRepository.CreateRequest(
      {
        student_id: student.id,
        purpose: data.purpose,
        notes: data.notes,
        delivery_method: data.delivery_method,
      },
      t,
    );

    if (Array.isArray(data.documents) && data.documents.length) {
      await Promise.all(
        data.documents.map(async (doc) => {
          const document = await documentRepository.FindByType(doc.type, t);

          if (document) {
            return requestedDocumentRepository.CreateRequestedDocument(
              {
                request_id: request.id,
                document_id: document.id,
                quantity: doc.quantity || 1,
              },
              t,
            );
          }

          return additionalDocumentRepository.CreateAdditionalDocument(
            {
              request_id: request.id,
              type: doc.type,
              quantity: doc.quantity || 1,
            },
            t,
          );
        }),
      );
    }

    if (files && files.length) {
      await Promise.all(
        files.map((file) => {
          return requirementRepository.CreateRequirement(
            {
              request_id: request.id,
              path: `uploads/requirements/${file.filename}`,
            },
            t,
          );
        }),
      );
    }

    return await requestRepository.FindRequestById(request.id, t, {
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
        {
          association: "requirements",
        },
      ],
    });
  });

  try {
    await mailService.SendMail({
      to: result.student.email,
      status: "pending",
      data: result,
    });
  } catch (err) {
    console.error("Failed to send pending email:", err.message);
  }

  return result;
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
      {
        association: "logs",
        include: [
          {
            association: "account",
            attributes: ["id", "first_name", "middle_name", "last_name"],
          },
        ],
      },
      {
        association: "receipts",
      },
    ],
  });

  const formattedLogs = (request.logs || []).map((log) => {
    const account = log.account;

    let full_name = null;

    return {
      ...log.toJSON(),
      account_full_name: account ? account.getFullName() : null,
    };
  });

  return {
    ...request.toJSON(),
    logs: formattedLogs,
  };
}

async function GetAllRequestsWithStudent(page = 1, limit = 10, filters = []) {
  const { docs, pages, total } =
    await requestRepository.FetchAllRequestsWithStudent(page, limit, filters);

  const result = docs.map((req) => {
    const student = req.student;

    const totalDocuments =
      req.getTotalDocumentQuantity() + req.getTotalAdditionalQuantity();

    const totalPrice = req.getGrandTotal();

    const hasOther = (req.additional_documents || []).length > 0;
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
        other: hasOther,
        created_at: req.createdAt.toISOString(),
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

async function GetRequestByReferenceNumber(referenceNumber) {
  // Use repository to fetch the request by reference_number
  const request = await requestRepository.FindByReferenceNumber(
    referenceNumber,
    {
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
        {
          association: "logs",
          include: [
            {
              association: "account",
              attributes: ["id", "first_name", "middle_name", "last_name"],
            },
          ],
        },
        {
          association: "receipts",
        },
      ],
    },
  );

  const formattedLogs = (request.logs || []).map((log) => {
    const account = log.account;

    let full_name = null;

    if (account) {
      const middleInitial = account.middle_name
        ? ` ${account.middle_name.charAt(0).toUpperCase()}.`
        : "";

      full_name = `${account.last_name}, ${account.first_name}${middleInitial}`;
    }

    return {
      ...log.toJSON(),
      account_full_name: full_name,
    };
  });

  return {
    ...request.toJSON(),
    logs: formattedLogs,
  };
}

module.exports = {
  RequestDocuments,
  SendRequestEmail,
  GetRequestWithStudent,
  GetAllRequestsWithStudent,
  GetRequestByReferenceNumber,
  GetRequestAnalytics,
};
