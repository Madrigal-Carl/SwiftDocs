const Joi = require("joi");

const updateAccountSchema = Joi.object({
  first_name: Joi.string().trim().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name cannot be empty",
  }),
  middle_name: Joi.string().trim().allow(null, "").messages({
    "string.base": "Middle name must be a string",
  }),
  last_name: Joi.string().trim().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty",
  }),
  suffix: Joi.string().trim().allow(null, "").messages({
    "string.base": "Suffix must be a string",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  role: Joi.string().valid("cashier", "rmo").messages({
    "any.only": "Role must be either cashier, or rmo",
  }),
  remember_me: Joi.boolean().messages({
    "boolean.base": "Remember me must be true or false",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

function validateUpdateAccount(req, res, next) {
  const { error, value } = updateAccountSchema.validate(req.body, {
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

module.exports = { validateUpdateAccount };
