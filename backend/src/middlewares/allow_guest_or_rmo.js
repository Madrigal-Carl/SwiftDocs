const jwt = require("jsonwebtoken");

function allowGuestOrRMO(req, res, next) {
  const token = req.cookies?.access_token;

  // ✅ Guest → allow
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Allow if RMO
    if (decoded.role === "rmo") {
      req.user = decoded; // keep consistency with requireRole
      return next();
    }

    // ❌ Logged in but NOT RMO
    return res.status(403).json({
      message: "Forbidden: Only RMO can perform this action",
    });
  } catch (err) {
    // ❌ Invalid token → treat as guest OR reject?
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = allowGuestOrRMO;