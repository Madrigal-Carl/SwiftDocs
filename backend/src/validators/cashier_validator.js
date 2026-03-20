const Joi = require("joi");

const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid("paid").required().messages({
    "string.empty": "Status is required",
    "any.only": "Status must be paid",
    "any.required": "Status is required",
  }),
  note: Joi.string().trim().empty("").default(null).optional(),
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
