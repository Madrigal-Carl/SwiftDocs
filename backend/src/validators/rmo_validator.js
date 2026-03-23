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
    then: Joi.string().trim().required().messages({
      "string.empty": "Rejection reason is required",
      "any.required": "Rejection reason is required",
    }),
    otherwise: Joi.string().trim().empty("").default(null).optional(),
  }),
  additional_documents: Joi.when("status", {
    is: "invoiced",
    then: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          unit_price: Joi.number().min(0).required(),
        }),
      )
      .optional(),
    otherwise: Joi.forbidden(),
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
