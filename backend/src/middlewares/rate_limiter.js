// /middlewares/rate_limiter.js
const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { ipKeyGenerator } = require("express-rate-limit");
const redis = require("../config/redis");

const createStore = (prefix) =>
  new RedisStore({
    sendCommand: (command, ...args) => {
      if (!command) return Promise.resolve();
      return redis.call(command, ...args);
    },
    prefix,
  });

/*
|--------------------------------------------------------------------------
| LIMITERS
|--------------------------------------------------------------------------
*/

// Global (light) limiter
const globalLimiter = rateLimit({
  store: createStore("global:"),
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased from 300
  standardHeaders: true,
  legacyHeaders: false,
});

// API normal limiter
const apiLimiter = rateLimit({
  store: createStore("api:"),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100
});

// Strict limiter (auth, login, email)
const strictLimiter = rateLimit({
  store: createStore("strict:"),
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts. Try again later." },
});

// User-based limiter (per user)
const userLimiter = rateLimit({
  store: createStore("user:"),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased from 30
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
});

// Upload limiter (heavy endpoints)
const uploadLimiter = rateLimit({
  store: createStore("upload:"),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 10
  message: { message: "Too many uploads. Please slow down." },
});

module.exports = {
  globalLimiter,
  apiLimiter,
  strictLimiter,
  userLimiter,
  uploadLimiter,
};
