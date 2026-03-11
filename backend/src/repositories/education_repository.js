const { Education } = require("../database/models");

function CreateEducation(data, transaction) {
  return Education.create(data, { transaction });
}

function FindEducationById(id, transaction, options = {}) {
  return Education.findByPk(id, { transaction, ...options });
}

module.exports = { CreateEducation, FindEducationById };
