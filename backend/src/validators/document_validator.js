const Joi = require("joi");

// CREATE
const createSchema = Joi.object({
  type: Joi.string().trim().required().messages({
    "string.empty": "Document type is required",
    "any.required": "Document type is required",
  }),
  price: Joi.number().min(0).required().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
});

// UPDATE (PATCH)
const updateSchema = Joi.object({
  type: Joi.string().trim().optional().messages({
    "string.base": "Document type must be a string",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });

// middleware
function validateCreateDocument(req, res, next) {
  const { error, value } = createSchema.validate(req.body, {
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

function validateUpdateDocument(req, res, next) {
  const { error, value } = updateSchema.validate(req.body, {
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
  validateCreateDocument,
  validateUpdateDocument,
};
