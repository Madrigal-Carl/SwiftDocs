const { Special_Order } = require("../database/models");

function CreateSpecialOrder(data, transaction) {
  return Special_Order.create(data, { transaction });
}

module.exports = {
  CreateSpecialOrder,
};
