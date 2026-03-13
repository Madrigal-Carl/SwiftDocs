const { Requested_Document } = require("../database/models");

function CreateRequestedDocument(data, transaction) {
  return Requested_Document.create(data, { transaction });
}

module.exports = {
  CreateRequestedDocument,
};
