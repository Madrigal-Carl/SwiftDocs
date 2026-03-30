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

async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  try {
    const proofPaths = (req.files || []).map(
      (file) => `uploads/proofs/${file.filename}`
    );

    const request = await cashierService.UpdateRequestStatus(
      Number(req.params.id),
      req.body.status,
      req.user,
      req.body.note,
      proofPaths,
      req.body.or_number // OR number from frontend
    );

    io.emit("requestsUpdated");

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message || "Failed to update request status",
    });
  }
}

module.exports = {
  GetRequestsForCashier,
  UpdateRequestStatus,
};
