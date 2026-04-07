const rateLimit = require("express-rate-limit");

/*
|--------------------------------------------------------------------------
| GLOBAL LIMITER (light)
|--------------------------------------------------------------------------
*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // overall traffic cap
  standardHeaders: true,
  legacyHeaders: false,
});

/*
|--------------------------------------------------------------------------
| NORMAL API LIMITER
|--------------------------------------------------------------------------
*/
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

/*
|--------------------------------------------------------------------------
| STRICT LIMITER (auth, email, etc.)
|--------------------------------------------------------------------------
*/
const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts. Try again later." },
});

/*
|--------------------------------------------------------------------------
| USER-BASED LIMITER (after auth)
|--------------------------------------------------------------------------
*/
const userLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id || req.ip,
});

/*
|--------------------------------------------------------------------------
| UPLOAD LIMITER (heavy endpoints)
|--------------------------------------------------------------------------
*/
const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { message: "Too many uploads. Please slow down." },
});

module.exports = {
  globalLimiter,
  apiLimiter,
  strictLimiter,
  userLimiter,
  uploadLimiter,
};
