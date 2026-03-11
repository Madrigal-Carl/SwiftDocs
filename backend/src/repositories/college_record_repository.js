const { CollegeRecord } = require("../database/models");

function CreateCollegeRecord(data, transaction) {
  return CollegeRecord.create(data, { transaction });
}

function FindCollegeRecordById(id, transaction, options = {}) {
  return CollegeRecord.findByPk(id, { transaction, ...options });
}

module.exports = { CreateCollegeRecord, FindCollegeRecordById };
