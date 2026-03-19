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

async function GetAllRequestStatuses() {
  return Request.findAll({
    attributes: ["status", "request_date"],
    include: [
      {
        association: "requested_documents",
        include: ["document"],
      },
      {
        association: "additional_documents",
      },
    ],
  });
}

module.exports = {
  CreateRequest,
  FindRequestById,
  FindByReferenceNumber,
  GetAllRequestStatuses,
};
