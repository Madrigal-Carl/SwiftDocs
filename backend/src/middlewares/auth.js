const jwt = require("jsonwebtoken");
const { getCookieOptions } = require("../utils/auth_cookies");
const { Account } = require("../database/models");

async function requireAuth(req, res, next) {
  const accessToken = req.cookies.access_token;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      const account = await Account.findByPk(decoded.id);
      req.user = account;

      return next();
    } catch (err) {}
  }

  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json({ message: "Session expired" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const account = await Account.findByPk(payload.id);

    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie(
      "access_token",
      newAccessToken,
      getCookieOptions(Number(process.env.JWT_COOKIE_MAX_AGE)),
    );

    req.user = account;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
}

module.exports = requireAuth;
