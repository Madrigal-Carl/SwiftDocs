const sequelize = require("../database/models").sequelize;
const documentRepository = require("../repositories/document_repository");

//create document
async function CreateDocument(data) {
  return sequelize.transaction(async (t) => {
    const { type, price } = data;

    if (!type) throw new Error("Document type is required");

    // 1️⃣ Check for existing active document with the same type
    const existingActive = await documentRepository.FindByType(type, t);
    if (existingActive) {
      throw new Error("Document type already exists");
    }

    // 2️⃣ Look for any soft-deleted document (slot reuse)
    const deletedDoc = await documentRepository.FindDeletedByType(null, t);

    if (deletedDoc) {
      // Restore the soft-deleted row (clears deleted_at automatically)
      await deletedDoc.restore({ transaction: t });

      // Update type and price after restoring
      await documentRepository.UpdateDocument(
        deletedDoc,
        { type, price: price || 0 },
        t
      );

      return deletedDoc;
    }

    // 3️⃣ Otherwise, create a new document
    return documentRepository.CreateDocument({ type, price: price || 0 }, t);
  });
}


//update document
async function UpdateDocument(id, data) {
  return sequelize.transaction(async (t) => {
    const { type, price } = data;

    const document = await documentRepository.FindDocumentById(id, t);

    if (!document) {
      throw new Error("Document not found");
    }

    if (type && type !== document.type) {
      const existing = await documentRepository.FindByType(type, t);

      if (existing) {
        throw new Error("Document type already exists");
      }
    }

    await document.update(
      {
        type: type ?? document.type,
        price: price ?? document.price,
      },
      { transaction: t }
    );

    return document;
  });
}

//soft delete document
async function DeleteDocument(id) {
  return sequelize.transaction(async (t) => {
    const document = await documentRepository.FindDocumentById(id, t);

    if (!document) {
      throw new Error("Document not found");
    }

    await document.destroy({ transaction: t });

    return {
      message: "Document deleted successfully",
    };
  });
}

async function GetAllDocuments({ includeDeleted = false } = {}) {
  return sequelize.transaction(async (t) => {
    // If includeDeleted is true, fetch all including soft-deleted
    const documents = await documentRepository.FindAllDocuments(t, includeDeleted);
    return documents;
  });
}
module.exports = {
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
  GetAllDocuments,
};