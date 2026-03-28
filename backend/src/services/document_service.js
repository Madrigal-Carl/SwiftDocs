const sequelize = require("../database/models").sequelize;
const documentRepository = require("../repositories/document_repository");
const requestRepository = require("../repositories/request_repository");

async function GetAllDocuments(page = 1, limit = 10, filters = {}) {
  const { docs, pages, total } = await documentRepository.GetAllDocuments(
    page,
    limit,
    filters,
  );

  const result = docs.map((doc) => ({
    id: doc.id,
    type: doc.type,
    price: doc.price,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  }));

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

async function GetDocumentById(id) {
  const document = await documentRepository.FindDocumentById(id);

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  return document;
}

async function CreateDocument(data) {
  return sequelize.transaction(async (t) => {
    const { type, price = 0 } = data;

    const doctype = type.toLowerCase().trim();

    // 1️⃣ Check active document
    const existing = await documentRepository.FindDeletedDocumentByType(
      doctype,
      t,
    );
    if (existing && !existing.deleted_at) {
      const error = new Error("Document type already exists");
      error.statusCode = 400;
      throw error;
    }

    // 2️⃣ Restore if soft-deleted
    if (existing && existing.deleted_at) {
      await existing.restore({ transaction: t });
      return documentRepository.UpdateDocument(existing, { price }, t);
    }

    // 3️⃣ Otherwise create new
    return documentRepository.CreateDocument({ type, price }, t);
  });
}

async function UpdateDocument(id, data) {
  return sequelize.transaction(async (t) => {
    const document = await documentRepository.FindDocumentById(id, t);

    if (!document) {
      const error = new Error("Document not found");
      error.statusCode = 404;
      throw error;
    }

    if (data.type) {
      data.type = data.type.toLowerCase().trim();

      if (data.type !== document.type) {
        const existing = await documentRepository.FindDeletedDocumentByType(
          data.type,
          t,
        );

        if (existing && !existing.deleted_at) {
          const error = new Error("Document type already exists");
          error.statusCode = 400;
          throw error;
        }
      }
    }

    return documentRepository.UpdateDocument(document, data, t);
  });
}

async function DeleteDocument(id) {
  return sequelize.transaction(async (t) => {
    const document = await documentRepository.FindDocumentById(id, t);

    if (!document) {
      const error = new Error("Document not found");
      error.statusCode = 404;
      throw error;
    }

    await documentRepository.SoftDeleteDocument(document, t);

    return { message: "Document deleted successfully" };
  });
}

async function ComputeDocumentAnalytics(timeframe = "year") {
  const requests = await requestRepository.GetAllRequestStatuses();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let startDate;
  if (timeframe === "week") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);
  } else if (timeframe === "month") {
    startDate = new Date(currentYear, currentMonth, 1);
  } else {
    startDate = new Date(currentYear, 0, 1);
  }

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const documentTypeCounts = {};

  requests.forEach((req) => {
    const status = req.status;
    const requestDate = req.request_date ? new Date(req.request_date) : null;

    if (!requestDate || requestDate < startDate || requestDate > endDate)
      return;

    const isValid = status === "paid" || status === "released";
    if (!isValid) return;

    (req.requested_documents || []).forEach((rd) => {
      const type = rd.document?.type || "Unknown";
      const qty = rd.quantity || 0;
      documentTypeCounts[type] = (documentTypeCounts[type] || 0) + qty;
    });

    (req.additional_documents || []).forEach((ad) => {
      const qty = ad.quantity || 0;
      documentTypeCounts["Others"] = (documentTypeCounts["Others"] || 0) + qty;
    });
  });

  const sorted = Object.fromEntries(
    Object.entries(documentTypeCounts).sort((a, b) => b[1] - a[1]),
  );

  return sorted;
}
async function GetAllDocumentsNoPagination() {
  const docs = await documentRepository.GetAllDocumentsNoPagination();

  return docs.map((doc) => ({
    id: doc.id,
    type: doc.type,
    price: doc.price,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  }));
}

module.exports = {
  GetAllDocuments,
  GetDocumentById,
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
  ComputeDocumentAnalytics,
  GetAllDocumentsNoPagination,
};
