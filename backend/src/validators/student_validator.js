const Joi = require("joi");

function validateCreateStudent(req, res, next) {
  const schema = Joi.object({
    first_name: Joi.string().required().messages({
      "string.empty": "First name is required",
      "any.required": "First name is required",
    }),
    middle_name: Joi.string().allow(null, ""),
    last_name: Joi.string().required().messages({
      "string.empty": "Last name is required",
      "any.required": "Last name is required",
    }),
    suffix: Joi.string().allow(null, ""),
    birth_date: Joi.date().required().messages({
      "date.base": "Birth date must be a valid date",
      "any.required": "Birth date is required",
    }),
    sex: Joi.string().valid("male", "female").required().messages({
      "any.only": "Sex must be either male or female",
      "any.required": "Sex is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address is required",
      "any.required": "Address is required",
    }),
    phone_number: Joi.string().length(11).pattern(/^\d+$/).required().messages({
      "string.empty": "Phone number is required",
      "string.length": "Phone number must be exactly 11 digits",
      "string.pattern.base": "Phone number must contain only numbers",
      "any.required": "Phone number is required",
    }),
    lrn: Joi.string().required().messages({
      "string.empty": "LRN is required",
      "any.required": "LRN is required",
    }),
    education_level: Joi.string()
      .valid("college", "senior_high")
      .required()
      .messages({
        "any.only": "Education level must be either college or senior_high",
        "any.required": "Education level is required",
      }),
    school_last_attended: Joi.number().required().messages({
      "number.base": "School last attended must be a valid ID",
      "any.required": "School last attended is required",
    }),
    admission_date: Joi.string().required().messages({
      "string.empty": "Admission date is required",
      "any.required": "Admission date is required",
    }),
    completion_status: Joi.string()
      .valid("graduate", "undergraduate")
      .required()
      .messages({
        "any.only":
          "Completion status must be either graduate or undergraduate",
        "any.required": "Completion status is required",
      }),
    graduation_date: Joi.string().allow(null, ""),
    attendance_period: Joi.string().allow(null, ""),
    track: Joi.string().when("education_level", {
      is: "senior_high",
      then: Joi.required().messages({
        "string.empty": "Track is required for senior high students",
        "any.required": "Track is required for senior high students",
      }),
      otherwise: Joi.forbidden(),
    }),
    course: Joi.string().when("education_level", {
      is: "college",
      then: Joi.required().messages({
        "string.empty": "Course is required for college students",
        "any.required": "Course is required for college students",
      }),
      otherwise: Joi.forbidden(),
    }),
    notes: Joi.string().allow(null, ""),
    documents: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required().messages({
            "string.empty": "Document type is required",
            "any.required": "Document type is required",
          }),
          quantity: Joi.number().min(1).default(1).messages({
            "number.base": "Document quantity must be a number",
            "number.min": "Document quantity must be at least 1",
          }),
        }),
      )
      .default([]),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      message: error.details[0].message,
    });

  next();
}

module.exports = { validateCreateStudent };
