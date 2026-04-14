const { Validation } = require("../database/models");

async function CreateValidation(data, transaction) {
  return await Validation.create(data, { transaction });
}

module.exports = {
  CreateValidation,
};
