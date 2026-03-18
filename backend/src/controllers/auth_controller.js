const authService = require("../services/auth_service");

async function register(req, res) {
  try {
    const result = await authService.register(req.body, res);
    res.status(201).json(result);
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ message: err.message || "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body, res);
    res.status(200).json(result);
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ message: err.message || "Invalid email or password" });
  }
}

async function logout(req, res) {
  try {
    const result = await authService.logout(res, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
}

async function me(req, res) {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      fullname: req.user.getFullName(),
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
};