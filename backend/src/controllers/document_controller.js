const documentService = require("../services/document_service");

async function GetAllDocuments(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const documents = await documentService.GetAllDocuments(page, limit, {
    search,
  });

  res.json(documents);
}

async function GetDocumentById(req, res) {
  const document = await documentService.GetDocumentById(Number(req.params.id));

  res.json(document);
}

async function CreateDocument(req, res) {
  const io = req.app.get("io");
  const document = await documentService.CreateDocument(req.body);

  io.emit("documentsUpdated");
  res.status(201).json(document);
}

async function UpdateDocument(req, res) {
  const io = req.app.get("io");
  const document = await documentService.UpdateDocument(
    Number(req.params.id),
    req.body,
  );

  io.emit("documentsUpdated");
  res.json(document);
}

async function DeleteDocument(req, res) {
  const io = req.app.get("io");
  const result = await documentService.DeleteDocument(Number(req.params.id));

  io.emit("documentsUpdated");
  res.json(result);
}

async function GetDocumentAnalytics(req, res) {
  const analytics = await documentService.ComputeDocumentAnalytics();

  res.json(analytics);
}

async function GetAllDocumentsNoPagination(req, res) {
  const documents = await documentService.GetAllDocumentsNoPagination();
  res.json(documents);
}

module.exports = {
  GetAllDocuments,
  GetDocumentById,
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
  GetDocumentAnalytics,
  GetAllDocumentsNoPagination,
};
