const requestService = require("../services/request_service");

async function CreateRequest(req, res) {
  const io = req.app.get("io");

  const request = await requestService.RequestDocuments(req.body, req.files);

  io.emit("requestsUpdated");

  res.status(201).json(request);
}

async function SendRequestEmail(req, res) {
  try {
    const result = await requestService.SendRequestEmail(
      req.params.referenceNumber,
    );

    res.json({
      message: "Email sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      message: error.message || error,
    });
  }
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
  const search = req.query.search || "";
  const status = req.query.status || "";

  const requests = await requestService.GetAllRequestsWithStudent(page, limit, {
    search,
    status,
  });

  res.json(requests);
}

async function GetRequestAnalytics(req, res) {
  const timeframe = req.query.timeframe || "year";
  const role = req.user?.role || "admin";

  const stats = await requestService.GetRequestAnalytics(timeframe, role);

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
