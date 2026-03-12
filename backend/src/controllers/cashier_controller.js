const cashierService = require("../services/cashier_service");

async function GetStudentsForCashier(req, res) {
  const students = await cashierService.GetStudentsForCashier();
  res.json(students);
}

async function UpdateRequestStatus(req, res) {
  const request = await cashierService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user
  );

  res.json(request);
}

module.exports = {
  GetStudentsForCashier,
  UpdateRequestStatus,
};