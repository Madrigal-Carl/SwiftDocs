const sequelize = require("../database/models").sequelize;
const documentRepository = require("../repositories/document_repository");

async function GetAllDocuments() {
  return documentRepository.GetAllDocuments();
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

    type = type.toLowerCase().trim();

    // 1️⃣ Check active document
    const existing = await documentRepository.FindDeletedDocumentByType(
      type,
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
