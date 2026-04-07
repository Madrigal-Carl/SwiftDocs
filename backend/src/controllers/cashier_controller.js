const cashierService = require("../services/cashier_service");

async function GetRequestsForCashier(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";

  const requests = await cashierService.GetRequestsForCashier(page, limit, {
    search,
    status,
  });

  res.json(requests);
}

async function ApprovePayment(req, res) {
  const io = req.app.get("io");

  const proofPaths = (req.files || []).map(
    (file) => `uploads/proofs/${file.filename}`,
  );

  const request = await cashierService.ApprovePayment(
    Number(req.params.id),
    req.body.status,
    req.user,
    req.body.note,
    proofPaths,
    req.body.or_number,
  );

  io.emit("requestsUpdated");

  res.json(request);
}

async function UpdateToReview(req, res) {
  const io = req.app.get("io");

  const request = await cashierService.UpdateToReview(
    Number(req.params.id),
    req.body.status,
    req.user,
    req.body.note,
  );

  io.emit("requestsUpdated");

  res.json(request);
}

module.exports = {
  GetRequestsForCashier,
  ApprovePayment,
  UpdateToReview,
};
