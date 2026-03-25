const rmoService = require("../services/rmo_service");

async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  const request = await rmoService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user,
    req.body.note,
    req.body.additional_documents,
  );

  io.emit("requestsUpdated");

  res.json(request);
}

async function UpdateAdditionalDocumentPrices(req, res) {
  const request = await rmoService.UpdateAdditionalDocumentPrices(
    Number(req.params.id),
    req.body.additional_documents,
    req.user,
  );

  res.json(request);
}

module.exports = {
  UpdateRequestStatus,
  UpdateAdditionalDocumentPrices,
};
