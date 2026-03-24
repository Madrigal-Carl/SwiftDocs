const accountRepository = require("../repositories/account_repository");

async function getAllAccounts(page = 1, limit = 5, filters = {}) {
  const { docs, pages, total } = await accountRepository.fetchAllAccounts(
    page,
    limit,
    filters,
  );

  const result = docs.map((account) => ({
    id: account.id,
    full_name: account.getFullName(),
    email: account.email,
    role: account.role,
    status: account.status,
    created_at: account.createdAt,
    updated_at: account.updatedAt,
  }));

  return {
    data: result,
    pagination: {
      total,
      pages,
      page,
      limit,
    },
  };
}

async function getAccountById(id) {
  const account = await accountRepository.findById(id);
  if (!account) return null;

  return {
    id: account.id,
    full_name: account.getFullName(),
    first_name: account.first_name,
    middle_name: account.middle_name,
    last_name: account.last_name,
    email: account.email,
    role: account.role,
    created_at: account.createdAt,
    updated_at: account.updatedAt,
  };
}

async function updateAccount(id, data) {
  const account = await accountRepository.findById(id);
  if (!account) return null;

  Object.assign(account, data);
  await account.save();

  return {
    id: account.id,
    full_name: account.getFullName(),
    email: account.email,
    role: account.role,
    created_at: account.createdAt,
    updated_at: account.updatedAt,
  };
}

async function getUserStats() {
  const accounts = await accountRepository.fetchAllAccountsRaw();

  const nonAdminAccounts = accounts.filter((acc) => acc.role !== "admin");

  const activeUsers = nonAdminAccounts.filter((acc) => acc.status === "active");

  const stats = {
    totalUser: nonAdminAccounts.length,
    activeUser: activeUsers.length,
    rmoCount: nonAdminAccounts.filter((acc) => acc.role === "rmo").length,
    cashierCount: nonAdminAccounts.filter((acc) => acc.role === "cashier")
      .length,
  };

  return stats;
}

module.exports = {
  getAllAccounts,
  getAccountById,
  updateAccount,
  getUserStats,
};
