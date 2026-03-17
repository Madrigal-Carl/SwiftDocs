const documentService = require("../services/document_service");

// create document
async function CreateDocument(req, res) {
  try {
    // optional quick check before calling service
    if (!req.body.type) {
      return res.status(400).json({ error: "Document type is required" });
    }

    const document = await documentService.CreateDocument(req.body);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// update document
async function UpdateDocument(req, res) {
  try {
    const document = await documentService.UpdateDocument(
      Number(req.params.id),
      req.body
    );
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// soft delete document
async function DeleteDocument(req, res) {
  try {
    const result = await documentService.DeleteDocument(Number(req.params.id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  CreateDocument,
  UpdateDocument,
  DeleteDocument,
};