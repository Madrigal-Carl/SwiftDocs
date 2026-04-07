const Joi = require("joi");

const schema = Joi.object({
  first_name: Joi.string().trim().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  middle_name: Joi.string().trim().allow(null, "").messages({
    "string.base": "Middle name must be a string",
  }),
  last_name: Joi.string().trim().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  suffix: Joi.string().trim().allow(null, "").messages({
    "string.base": "Suffix must be a string",
  }),
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
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  phone_number: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.empty": "Phone number is required",
    "string.length": "Phone number must be exactly 11 digits",
    "string.pattern.base": "Phone number must contain only numbers",
    "any.required": "Phone number is required",
  }),
  lrn: Joi.string().trim().optional().messages({
    "string.base": "LRN must be a string",
  }),
  purpose: Joi.string().required().messages({
    "string.empty": "Purpose is required",
    "any.required": "Purpose is required",
  }),
  delivery_method: Joi.string()
    .valid("delivery", "pickup")
    .required()
    .messages({
      "any.only": "Delivery method must be delivery or pickup",
      "any.required": "Delivery method is required",
    }),
  education_level: Joi.string()
    .valid("college", "senior_high")
    .required()
    .messages({
      "any.only": "Education level must be either college or senior_high",
      "any.required": "Education level is required",
    }),
  program: Joi.string().required().messages({
    "string.empty": "Program is required",
    "any.required": "Program is required",
  }),
  school_last_attended: Joi.string().required().messages({
    "string.empty": "School Last Attended is required",
    "any.required": "School Last Attended is required",
  }),
  admission_date: Joi.string().required().messages({
    "string.empty": "Admission date is required",
    "any.required": "Admission date is required",
  }),
  completion_status: Joi.string()
    .valid("graduate", "undergraduate")
    .required()
    .messages({
      "any.only": "Completion status must be either graduate or undergraduate",
      "any.required": "Completion status is required",
    }),
  graduation_date: Joi.string().allow(null, "").messages({
    "string.base": "Graduation date must be a string",
  }),
  attendance_period: Joi.string().allow(null, "").messages({
    "string.base": "Attendance period must be a string",
  }),
  notes: Joi.string().allow(null, "").messages({
    "string.base": "Notes must be a string",
  }),
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
    .min(1)
    .required()
    .messages({
      "array.base": "Documents must be an array",
      "array.min": "At least one document is required",
      "any.required": "Documents are required",
    }),
});

function validateCreateRequest(req, res, next) {
  if (typeof req.body.documents === "string") {
    try {
      req.body.documents = JSON.parse(req.body.documents);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid documents format",
      });
    }
  }

  const { error, value } = schema.validate(req.body, {
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

module.exports = { validateCreateRequest };
