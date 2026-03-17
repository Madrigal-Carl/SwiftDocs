const sequelize = require("../database/models").sequelize;
const documentRepository = require("../repositories/document_repository");

//create document
async function CreateDocument(data) {
  return sequelize.transaction(async (t) => {
    const { type, price } = data;

    if (!type) {
      throw new Error("Document type is required");
    }

    const existing = await documentRepository.FindByType(type, t);

    if (existing) {
      throw new Error("Document type already exists");
    }

    const document = await documentRepository.CreateDocument(
      {
        type,
        price: price || 0,
      },
      t
    );

    return document;
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

module.exports = {
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
};