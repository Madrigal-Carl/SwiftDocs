const { Account } = require("../database/models");

async function findByEmail(email) {
  return await Account.findOne({
    where: { email },
  });
}

async function findById(id) {
  return await Account.findByPk(id);
}

async function create(data) {
  return await Account.create(data);
}

async function updateRememberMe(id, remember) {
  const account = await Account.findByPk(id);

  if (!account) return null;

  account.remember_me = remember;
  await account.save();

  return account;
}

async function fetchAllAccounts() {
  return await Account.findAll({
    order: [["createdAt", "DESC"]],
  });
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateRememberMe,
  fetchAllAccounts,
};
