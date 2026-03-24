const sequelize = require("../database/models").sequelize;
const documentRepository = require("../repositories/document_repository");

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

module.exports = {
  GetAllDocuments,
  GetDocumentById,
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
};
