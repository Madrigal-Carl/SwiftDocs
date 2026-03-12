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
    req.user
  );

  // 🔹 Emit realtime update
  io.emit("requestStatusUpdated", {
    requestId: Number(req.params.id),
    status: req.body.status,
  });

  res.json(request);
}

module.exports = {
  GetStudentsForCashier,
  UpdateRequestStatus,
};