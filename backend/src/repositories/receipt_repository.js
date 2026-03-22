const { Receipt } = require("../database/models");

async function CreateReceipts(requestId, proofPaths = []) {
  if (!proofPaths || proofPaths.length === 0) return [];

  const receipts = proofPaths.map((path) => ({
    request_id: requestId,
    path,
  }));

  return await Receipt.bulkCreate(receipts);
}

async function GetReceiptsByRequestId(requestId) {
  return await Receipt.findAll({
    where: { request_id: requestId },
    order: [["createdAt", "DESC"]],
  });
}

async function DeleteReceiptsByRequestId(requestId) {
  return await Receipt.destroy({
    where: { request_id: requestId },
  });
}

module.exports = {
  CreateReceipts,
  GetReceiptsByRequestId,
  DeleteReceiptsByRequestId,
};
