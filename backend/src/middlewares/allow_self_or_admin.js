function allowSelfOrAdmin(req, res, next) {
  const paramId = Number(req.params.id);
  const userId = Number(req.user.id);
  const role = String(req.user.role).toLowerCase();

  console.log("USER:", userId);
  console.log("PARAM:", paramId);
  console.log("ROLE:", role);

  // Admin bypass
  if (role === "admin") {
    return next();
  }

  // Strict numeric comparison
  if (!isNaN(userId) && !isNaN(paramId) && userId === paramId) {
    return next();
  }

  console.log("❌ BLOCKED HERE");

  return res.status(403).json({
    message: "Forbidden: You can only update your own account",
  });
}
module.exports = allowSelfOrAdmin;