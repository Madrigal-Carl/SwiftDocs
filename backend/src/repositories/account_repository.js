const { Account, Sequelize } = require("../database/models");
const { Op } = Sequelize;

async function fetchAllAccounts(page = 1, limit = 10, filters = {}) {
  let { search = "", status = "" } = filters;

  search = search.trim().toLowerCase();
  status = status.trim().toLowerCase();

  const where = {
    role: { [Op.not]: "admin" }, // keep existing
  };

  // ✅ STATUS FILTER
  if (status !== "" && status !== "all statuses") {
    where.status = status;
  }

  // ✅ SEARCH FILTER
  if (search !== "") {
    const safeSearch = search.replace(/'/g, "''");

    where[Op.or] = [
      Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("email")), {
        [Op.like]: `%${safeSearch}%`,
      }),

      // 🔥 full name search (first + last)
      Sequelize.literal(`
        LOWER(CONCAT(first_name, ' ', last_name)) LIKE '%${safeSearch}%'
      `),
    ];
  }

  return Account.paginate({
    page,
    paginate: limit,
    order: [["createdAt", "DESC"]],
    where,
  });
}

async function fetchAllAccountsRaw() {
  return Account.findAll({
    where: {
      role: { [Op.not]: "admin" },
    },
  });
}

async function findById(id) {
  return Account.findByPk(id);
}

async function findByEmail(email) {
  return Account.findOne({
    where: { email },
  });
}

async function create(data) {
  return Account.create(data);
}

async function updateRememberMe(id, remember) {
  const account = await Account.findByPk(id);
  if (!account) return null;

  account.remember_me = remember;
  await account.save();

  return account;
}

async function findAdminAccount(options = {}) {
  return Account.findOne({
    where: {
      role: "admin",
    },
    ...options,
  });
}

module.exports = {
  fetchAllAccounts,
  fetchAllAccountsRaw,
  findById,
  findByEmail,
  create,
  updateRememberMe,
  findAdminAccount,
};
