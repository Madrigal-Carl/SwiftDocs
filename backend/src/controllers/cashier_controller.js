const cashierService = require("../services/cashier_service");

async function GetRequestsForCashier(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const requests = await cashierService.GetRequestsForCashier(page, limit);
  res.json(requests);
}

async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  const proofPaths = (req.files || []).map(
    (file) => `uploads/proofs/${file.filename}`,
  );

  const request = await cashierService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user,
    req.body.note,
    proofPaths,
  );

  io.emit("requestsUpdated");

  res.json(request);
}

module.exports = {
  GetRequestsForCashier,
  UpdateRequestStatus,
};
