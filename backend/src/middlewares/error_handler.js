module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.isJoi) {
    return res.status(400).json({
      message: err.details[0].message,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};
