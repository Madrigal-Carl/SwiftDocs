const Joi = require("joi");

const updateRequestStatusSchema = Joi.object({
  status: Joi.string()
    .valid("deficient", "invoiced", "released")
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": "Status must be deficient, invoiced, or released",
      "any.required": "Status is required",
    }),
  bills: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
      }),
    )
    .optional()
    .messages({
      "array.base": "Bills must be an array",
    }),
  expected_release_date: Joi.when("status", {
    is: "invoiced",
    then: Joi.alternatives()
      .try(
        Joi.date().messages({
          "date.base": "Expected release date must be a valid date",
        }),
      )
      .required()
      .messages({
        "any.required": "Expected release date is required",
      }),
    otherwise: Joi.string().trim().empty("").allow(null).optional(),
  }),
  note: Joi.when("status", {
    is: "deficient",
    then: Joi.string().trim().required().messages({
      "string.empty": "Remarks/Reason is needed",
      "any.required": "Remarks/Reason is needed",
    }),
    otherwise: Joi.string().trim().empty("").default(null).optional(),
  }),
});

const updateAdditionalDocumentsSchema = Joi.object({
  additional_documents: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required().messages({
          "number.base": "Additional document ID must be a number",
          "any.required": "Additional document ID is required",
        }),

        unit_price: Joi.number().min(1).required().messages({
          "number.base": "Unit price must be a number",
          "number.min": "Unit price must be greater than 0",
          "any.required": "Unit price is required",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Additional documents must be an array",
      "array.min": "At least one additional document is required",
      "any.required": "Additional documents are required",
    }),
});

function validateUpdateAdditionalDocuments(req, res, next) {
  const { error, value } = updateAdditionalDocumentsSchema.validate(req.body, {
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
  validateUpdateAdditionalDocuments,
};
