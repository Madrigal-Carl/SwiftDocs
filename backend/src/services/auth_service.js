const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accountRepository = require("../repositories/account_repository");
const { getCookieOptions } = require("../utils/auth_cookies");

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
}

function setAuthCookies(res, payload, rememberMe) {
  const accessToken = generateAccessToken(payload);

  res.cookie(
    "access_token",
    accessToken,
    getCookieOptions(Number(process.env.JWT_COOKIE_MAX_AGE)),
  );

  if (rememberMe) {
    const refreshToken = generateRefreshToken(payload);

    res.cookie(
      "refresh_token",
      refreshToken,
      getCookieOptions(Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)),
    );
  }
}

async function register(data, res) {
  const { first_name, middle_name, last_name, email, role, remember_me } = data;

  const normalizedEmail = email.toLowerCase();

  const existing = await accountRepository.findByEmail(normalizedEmail);

  if (existing) {
    throw new Error("Email already registered");
  }

  let plainPassword;
  if (role === "cashier") {
    plainPassword = "CashierPassword123";
  } else {
    plainPassword = "RmoPassword123";
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const account = await accountRepository.create({
    first_name,
    middle_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    remember_me,
  });

  const safeAccount = account.toJSON();
  delete safeAccount.password;

  return {
    message: "Registration successful",
    account: safeAccount,
  };
}

async function login({ email, password, remember_me }, res) {
  const normalizedEmail = email.toLowerCase();

  const account = await accountRepository.findByEmail(normalizedEmail);

  if (!account) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, account.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const updatedAccount = await accountRepository.updateRememberMe(
    account.id,
    remember_me,
  );

  const payload = {
    id: account.id,
    email: account.email,
    role: account.role,
  };

  setAuthCookies(res, payload, remember_me);

  const safeAccount = updatedAccount.toJSON();
  delete safeAccount.password;

  return {
    message: "Login successful",
    account: safeAccount,
  };
}

async function logout(res, accountId) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  await accountRepository.updateRememberMe(accountId, false);

  return {
    message: "Logged out successfully",
  };
}

module.exports = {
  register,
  login,
  logout,
};
