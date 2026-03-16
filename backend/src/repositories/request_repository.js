const { Request } = require("../database/models");

function CreateRequest(data, transaction) {
  return Request.create(data, { transaction });
}

function FindRequestById(id, transaction = null, options = {}) {
  return Request.findByPk(id, {
    transaction,
    ...options,
  });
}

async function FindByReferenceNumber(referenceNumber, options = {}) {
  return Request.findOne({
    where: { reference_number: referenceNumber },
    ...options,
  });
}

module.exports = {
  CreateRequest,
  FindRequestById,
  FindByReferenceNumber,
};
