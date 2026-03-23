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

async function FetchAllRequestsWithStudent(page = 1, limit = 10) {
  const requestIncludes = [
    {
      association: "student",
      attributes: ["id", "first_name", "middle_name", "last_name"],
      include: [
        {
          association: "education",
          attributes: ["lrn"],
        },
      ],
    },
    {
      association: "requested_documents",
      include: ["document"],
    },
    {
      association: "additional_documents",
    },
  ];

  return Request.paginate({
    page,
    paginate: limit,
    order: [["created_at", "DESC"]],
    include: requestIncludes,
  });
}

module.exports = {
  CreateRequest,
  FindRequestById,
  FindByReferenceNumber,
  GetAllRequestStatuses,
  FetchAllRequestsWithStudent,
};
