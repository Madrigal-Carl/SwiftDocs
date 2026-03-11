const { Document } = require("../database/models");

function CreateDocument(data, transaction) {
  return Document.create(data, { transaction });
}

function FindDocumentById(id, transaction, options = {}) {
  return Document.findByPk(id, { transaction, ...options });
}

module.exports = { CreateDocument, FindDocumentById };
