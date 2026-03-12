const { Log } = require("../database/models");

function CreateLog(data, transaction) {
  return Log.create(data, { transaction });
}

module.exports = { CreateLog };