const { Document } = require("../database/models");

function CreateDocument(data, transaction) {
  return Document.create(data, { transaction });
}

function FindDocumentById(id, transaction, options = {}) {
  return Document.findByPk(id, { transaction, ...options });
}

function FindByType(type, transaction) {
  return Document.findOne({
    where: { type },
    transaction,
  });
}

function UpdateDocument(document, data, transaction) {
  return document.update(data, { transaction });
}

function DeleteDocument(document, transaction) {
  return document.destroy({ transaction });
}

function FindDeletedByType(type = null, transaction) {
  const whereClause = type ? { type } : {}; // null means any
  return Document.findOne({
    where: whereClause,
    paranoid: false, // include deleted rows
    order: [["deleted_at", "DESC"]],
    transaction,
  });
}

function FindAllDocuments(transaction, includeDeleted = false) {
  return Document.findAll({
    transaction,
    paranoid: !includeDeleted, // if true, include soft-deleted
    order: [["id", "ASC"]],
  });
}
module.exports = {
  CreateDocument,
  FindDocumentById,
  FindByType,
  UpdateDocument,
  DeleteDocument,
  FindDeletedByType,
  FindAllDocuments,
};