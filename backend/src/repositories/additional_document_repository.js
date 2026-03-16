const { Additional_Document } = require("../database/models");

function CreateAdditionalDocument(data, transaction) {
  return Additional_Document.create(data, { transaction });
}

function FindAdditionalDocumentById(id, transaction, options = {}) {
  return Additional_Document.findByPk(id, { transaction, ...options });
}

function FindAllByRequest(requestId, transaction) {
  return Additional_Document.findAll({
    where: { request_id: requestId },
    transaction,
  });
}

module.exports = {
  CreateAdditionalDocument,
  FindAdditionalDocumentById,
  FindAllByRequest,
};
