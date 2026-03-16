const Joi = require("joi");

const updateRequestStatusSchema = Joi.object({
  status: Joi.string()
    .valid("invoiced", "rejected", "released")
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": "Status must be invoiced, rejected, or released",
      "any.required": "Status is required",
    }),
  note: Joi.when("status", {
    is: "rejected",
    then: Joi.string().min(3).required().messages({
      "string.empty": "Rejection reason is required",
      "any.required": "Rejection reason is required",
    }),
    otherwise: Joi.optional(),
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
