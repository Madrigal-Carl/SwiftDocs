const { Request } = require("../database/models");

function CreateRequest(data, transaction) {
  return Request.create(data, { transaction });
}

function FindRequestById(id, transaction, options = {}) {
  return Request.findByPk(id, { transaction, ...options });
}

module.exports = { CreateRequest, FindRequestById };
