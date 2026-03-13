const authService = require("../services/auth_service");

async function register(req, res) {
  const result = await authService.register(req.body, res);
  res.status(201).json(result);
}

async function login(req, res) {
  const result = await authService.login(req.body, res);
  res.status(200).json(result);
}

async function logout(req, res) {
  const result = await authService.logout(res, req.user.id);
  res.status(200).json(result);
}

module.exports = {
  register,
  login,
  logout,
};
