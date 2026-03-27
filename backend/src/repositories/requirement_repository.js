const { Requirement } = require("../database/models");

async function CreateRequirement(data, transaction) {
  return await Requirement.create(data, { transaction });
}

async function FindByRequestId(requestId, transaction) {
  return await Requirement.findAll({
    where: { request_id: requestId },
    transaction,
  });
}

async function DeleteByRequestId(requestId, transaction) {
  return await Requirement.destroy({
    where: { request_id: requestId },
    transaction,
  });
}

module.exports = {
  CreateRequirement,
  FindByRequestId,
  DeleteByRequestId,
};
