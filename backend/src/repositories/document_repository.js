const { Document } = require("../database/models");

function GetAllDocuments(page = 1, limit = 10) {
  return Document.paginate({
    page,
    paginate: limit,
    order: [["created_at", "DESC"]],
  });
}

function CreateDocument(data, transaction) {
  return Document.create(data, { transaction });
}

function FindDocumentById(id, transaction, options = {}) {
  return Document.findByPk(id, { transaction, ...options });
}

function FindDeletedDocumentByType(type, transaction) {
  return Document.findOne({
    where: { type },
    paranoid: false,
    order: [["deleted_at", "DESC"]],
    transaction,
  });
}

function UpdateDocument(document, data, transaction) {
  return document.update(data, { transaction });
}

function SoftDeleteDocument(document, transaction) {
  return document.destroy({ transaction });
}

module.exports = {
  CreateDocument,
  GetAllDocuments,
  FindDocumentById,
  FindDeletedDocumentByType,
  UpdateDocument,
  SoftDeleteDocument,
};
