const { Student } = require("../database/models");

function CreateStudent(data, transaction) {
  return Student.create(data, { transaction });
}

function FindStudentById(id, transaction, options = {}) {
  return Student.findByPk(id, { transaction, ...options });
}

module.exports = {
  CreateStudent,
  FindStudentById,
  sequelize: Student.sequelize,
};
