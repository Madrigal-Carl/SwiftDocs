const authService = require("../services/auth_service");

async function devLogin(req, res, next) {
  try {
    const result = await authService.login(
      {
        email: "admin@gmail.com",
        password: "Pass@123",
        remember_me: true,
      },
      res,
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = devLogin;
