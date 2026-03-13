const cashierService = require("../services/cashier_service");

async function GetStudentsForCashier(req, res) {
  const students = await cashierService.GetStudentsForCashier();
  res.json(students);
}

async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  const request = await cashierService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user,
  );

  io.emit("studentsUpdated");

  res.json(request);
}

module.exports = {
  GetStudentsForCashier,
  UpdateRequestStatus,
};
