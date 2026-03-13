const { Request } = require("../database/models");

function CreateRequest(data, transaction) {
  return Request.create(data, { transaction });
}

function FindRequestById(id, transaction, options = {}) {
  return Request.findByPk(id, { transaction, ...options });
}

async function UpdateRequestStatus(id, status, transaction) {
  const request = await Request.findByPk(id, { transaction });

  if (!request) return null;
  request.status = status;

  await request.save({ transaction });

  return request;
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
  UpdateRequestStatus,
  FindByReferenceNumber,
};
