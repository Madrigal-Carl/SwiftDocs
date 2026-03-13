const requestService = require("../services/request_service");

async function CreateRequest(req, res) {
  const io = req.app.get("io");
  const request = await requestService.RequestDocuments(req.body);

  io.emit("requestsUpdated");

  res.status(201).json(request);
}

async function GetRequest(req, res) {
  const request = await requestService.GetRequestWithStudent(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json(request);
}

async function GetAllRequestsWithStudent(req, res) {
  const requests = await requestService.GetAllRequestsWithStudent();

  res.json(requests);
}

module.exports = {
  CreateRequest,
  GetRequest,
  GetAllRequestsWithStudent,
};
