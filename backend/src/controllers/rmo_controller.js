const rmoService = require("../services/rmo_service");

async function UpdateRequestStatus(req, res) {
  try {
    const io = req.app.get("io");

    const result = await rmoService.UpdateRequestStatus(
      req.params.id,
      req.body.status,
      req.user,
      req.body.note,
      req.body.bills,
      req.body.expected_release_date,
    );

    io.emit("requestsUpdated");

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message || "Something went wrong" });
  }
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
