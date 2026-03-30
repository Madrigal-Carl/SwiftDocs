const { Receipt } = require("../database/models");

async function CreateReceipts(requestId, proofPaths = [], orNumberId) {
  if (!proofPaths || proofPaths.length === 0) return [];

  if (!orNumberId) {
    throw new Error("Cannot create receipts without OR number ID");
  }

  const receipts = proofPaths.map((path) => ({
    request_id: requestId,
    or_number_id: orNumberId, // ✅ link to OR_Number
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
