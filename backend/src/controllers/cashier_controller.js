const cashierService = require("../services/cashier_service");

async function GetRequestsForCashier(req, res) {
  const requests = await cashierService.GetRequestsForCashier();
  res.json(requests);
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
  GetRequestsForCashier,
  UpdateRequestStatus,
};
