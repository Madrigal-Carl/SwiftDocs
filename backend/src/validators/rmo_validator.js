const Joi = require("joi");

const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid("invoiced", "reject", "released").required().messages({
    "string.empty": "Status is required",
    "any.only": "Status must be invoiced, reject, or released",
    "any.required": "Status is required",
  }),
});

function validateUpdateRequestStatus(req, res, next) {
  const { error, value } = updateRequestStatusSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
}

module.exports = {
  validateUpdateRequestStatus,
};