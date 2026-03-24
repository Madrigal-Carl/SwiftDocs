const documentService = require("../services/document_service");

async function GetAllDocuments(req, res) {
  const io = req.app.get("io");
  const documents = await documentService.GetAllDocuments();

  io.emit("documentsUpdated");

  res.json(documents);
}

async function GetDocumentById(req, res) {
  const document = await documentService.GetDocumentById(Number(req.params.id));

  res.json(document);
}

async function CreateDocument(req, res) {
  const document = await documentService.CreateDocument(req.body);
  res.status(201).json(document);
}

async function UpdateDocument(req, res) {
  const document = await documentService.UpdateDocument(
    Number(req.params.id),
    req.body,
  );
  res.json(document);
}

async function DeleteDocument(req, res) {
  const result = await documentService.DeleteDocument(Number(req.params.id));
  res.json(result);
}

module.exports = {
  GetAllDocuments,
  GetDocumentById,
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
};
