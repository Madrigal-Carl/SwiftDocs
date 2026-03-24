const { Document, Sequelize } = require("../database/models");
const { Op } = Sequelize;

function GetAllDocuments(page = 1, limit = 10, filters = {}) {
  let { search = "" } = filters;

  search = search.trim().toLowerCase();

  const where = {};

  if (search !== "") {
    where[Op.or] = [
      Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("type")), {
        [Op.like]: `%${search}%`,
      }),
    ];
  }

  return Document.paginate({
    page,
    paginate: limit,
    order: [["created_at", "DESC"]],
    where,
  });
}

function CreateDocument(data, transaction) {
  return Document.create(data, { transaction });
}

function FindDocumentById(id, transaction, options = {}) {
  return Document.findByPk(id, { transaction, ...options });
}

function FindDeletedDocumentByType(type, transaction) {
  return Document.findOne({
    where: { type },
    paranoid: false,
    order: [["deleted_at", "DESC"]],
    transaction,
  });
}

function UpdateDocument(document, data, transaction) {
  return document.update(data, { transaction });
}

function SoftDeleteDocument(document, transaction) {
  return document.destroy({ transaction });
}

module.exports = {
  CreateDocument,
  GetAllDocuments,
  FindDocumentById,
  FindDeletedDocumentByType,
  UpdateDocument,
  SoftDeleteDocument,
};
