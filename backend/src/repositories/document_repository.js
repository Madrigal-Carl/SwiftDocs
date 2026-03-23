const { Document } = require("../database/models");

function GetAllDocuments(options = {}) {
  return Document.findAll({
    order: [["created_at", "DESC"]],
    ...options,
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
