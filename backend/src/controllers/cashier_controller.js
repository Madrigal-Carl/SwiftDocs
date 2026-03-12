const cashierService = require("../services/cashier_service");

async function GetStudentsForCashier(req, res) {
  const students = await cashierService.GetStudentsForCashier();

  res.json(students);
}

module.exports = {
  GetStudentsForCashier,
};