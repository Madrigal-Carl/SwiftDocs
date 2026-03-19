const rmoService = require("../services/rmo_service");

async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  const request = await rmoService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user,
    req.body.note,
  );

  io.emit("requestsUpdated");

  res.json(request);
}
async function SetAdditionalDocumentPrice(req, res) {
  const { id } = req.params; // requestId
  const { additionalDocumentId, unitPrice } = req.body;
  const account = req.account || req.user;

  const result = await rmoService.SetAdditionalDocumentPrice(
    Number(id),
    additionalDocumentId,
    unitPrice,
    account,
  );

  res.json(result);
}
module.exports = {
  UpdateRequestStatus,
  SetAdditionalDocumentPrice,
};
