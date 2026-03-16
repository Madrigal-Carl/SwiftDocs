const rmoService = require("../services/rmo_service");
async function UpdateRequestStatus(req, res) {
  const io = req.app.get("io");

  const request = await rmoService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user,
  );

  io.emit("studentsUpdated");

  res.json(request);
}

module.exports = {
  UpdateRequestStatus,
};
