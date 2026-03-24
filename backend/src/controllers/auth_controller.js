const authService = require("../services/auth_service");

async function register(req, res) {
  const io = req.app.get("io");

  const result = await authService.register(req.body, res);

  io.emit("accountsUpdated");

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

async function me(req, res) {
  const user = req.user;

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      fullname: user.getFullName(),
      status: user.status,
      createdAt: user.createdAt,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
