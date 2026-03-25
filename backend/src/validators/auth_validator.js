const Joi = require("joi");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-])[A-Za-z\d@$!%*?&#\-]{8,}$/;
const registerSchema = Joi.object({
  first_name: Joi.string().trim().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  middle_name: Joi.string().trim().allow("", null).messages({
    "string.base": "Middle name must be a string",
  }),
  last_name: Joi.string().trim().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
    "any.required": "Email is required",
  }),
  role: Joi.string().valid("cashier", "rmo").required().messages({
    "any.only": "Role must be admin, cashier, or rmo",
    "any.required": "Role is required",
  }),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  remember_me: Joi.boolean().required().messages({
    "boolean.base": "Remember me must be true or false",
    "any.required": "Remember me is required",
  }),
});

function validateRegister(req, res, next) {
  const { error, value } = registerSchema.validate(req.body, {
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

function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body, {
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
  validateRegister,
  validateLogin,
};
