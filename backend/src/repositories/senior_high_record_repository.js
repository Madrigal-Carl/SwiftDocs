const { SeniorHighRecord } = require("../database/models");

function CreateSeniorHighRecord(data, transaction) {
  return SeniorHighRecord.create(data, { transaction });
}

function FindSeniorHighRecordById(id, transaction, options = {}) {
  return SeniorHighRecord.findByPk(id, { transaction, ...options });
}

module.exports = { CreateSeniorHighRecord, FindSeniorHighRecordById };
