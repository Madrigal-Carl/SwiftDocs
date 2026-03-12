const rmoService = require("../services/rmo_service");

async function UpdateRequestStatus(req, res) {
  const request = await rmoService.UpdateRequestStatus(
    Number(req.params.id),
    req.body.status,
    req.user
  );

  res.json(request);
}

module.exports = {
  UpdateRequestStatus,
};