const accountRepository = require("../repositories/account_repository");
const bcrypt = require("bcrypt");

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
    status: account.status,
    created_at: account.createdAt,
    updated_at: account.updatedAt,
  };
}

async function updateAccount(id, data) {
  const account = await accountRepository.findById(id);
  if (!account) return null;

  // 🔒 whitelist fields
  const allowedFields = [
    "first_name",
    "middle_name",
    "last_name",
    "email",
    "role",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      account[field] = data[field];
    }
  });

  // 🔐 Handle password change
  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new Error("Current password is required");
    }

    const isMatch = await bcrypt.compare(
      data.currentPassword,
      account.password,
    );

    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    account.password = await bcrypt.hash(data.newPassword, 10);
  }

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

async function changePassword(userId, currentPassword, newPassword) {
  const account = await accountRepository.findById(userId);
  if (!account) return null;

  // 🔒 require current password
  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  // 🔍 verify current password
  const isMatch = await bcrypt.compare(currentPassword, account.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // 🔐 hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  account.password = hashedPassword;

  await account.save();

  return {
    message: "Password changed successfully",
  };
}

module.exports = {
  getAllAccounts,
  getAccountById,
  updateAccount,
  getUserStats,
  changePassword,
};
