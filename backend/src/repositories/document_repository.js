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

module.exports = {
  CreateDocument,
  FindDocumentById,
  FindByType,
  UpdateDocument,
  DeleteDocument,
};