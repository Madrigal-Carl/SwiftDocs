const { Account } = require("../database/models");
const { Op } = require("sequelize");

async function fetchAllAccounts(page = 1, limit = 6) {
  return Account.paginate({
    page,
    paginate: limit,
    order: [["createdAt", "DESC"]],
    where: {
      role: { [Op.not]: "admin" },
    },
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

module.exports = {
  fetchAllAccounts,
  fetchAllAccountsRaw,
  findById,
  findByEmail,
  create,
  updateRememberMe,
};
