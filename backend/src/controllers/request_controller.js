const requestService = require("../services/request_service");

async function CreateRequest(req, res) {
  const io = req.app.get("io");
  const request = await requestService.RequestDocuments(req.body);

  io.emit("requestsUpdated");

  res.status(201).json(request);
}

async function SendRequestEmail(req, res) {
  const result = await requestService.SendRequestEmail(
    req.params.referenceNumber,
  );

  res.json({
    message: "Email sent successfully",
    data: result,
  });
}

async function GetRequest(req, res) {
  const request = await requestService.GetRequestWithStudent(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json(request);
}

async function GetAllRequestsWithStudent(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const requests = await requestService.GetAllRequestsWithStudent(page, limit);

  res.json(requests);
}

async function GetRequestAnalytics(req, res) {
  const stats = await requestService.GetRequestAnalytics();

  res.json(stats);
}

async function GetRequestByReferenceNumber(req, res) {
  const referenceNumber = req.params.referenceNumber.trim().toLowerCase();

  const request =
    await requestService.GetRequestByReferenceNumber(referenceNumber);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json(request);
}

module.exports = {
  CreateRequest,
  SendRequestEmail,
  GetRequest,
  GetRequestByReferenceNumber,
  GetAllRequestsWithStudent,
  GetRequestAnalytics,
};
