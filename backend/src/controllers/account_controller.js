const accountService = require("../services/account_service");

async function getAllAccounts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const search = req.query.search || "";
  const status = req.query.status || "";

  const accounts = await accountService.getAllAccounts(page, limit, {
    search,
    status,
  });

  res.json(accounts);
}

async function getAccount(req, res) {
  const id = req.params.id;
  const account = await accountService.getAccountById(id);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  res.json(account);
}

async function updateAccount(req, res) {
  const io = req.app.get("io");
  const id = req.params.id;
  const data = req.body;

  const account = await accountService.updateAccount(id, data);

  if (!account) return res.status(404).json({ message: "Account not found" });

  io.emit("accountsUpdated");

  res.json(account);
}

async function getUserStats(req, res) {
  const stats = await accountService.getUserStats();
  res.json(stats);
}

module.exports = {
  getAllAccounts,
  getAccount,
  updateAccount,
  getUserStats,
};
