const Joi = require("joi");

const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid("paid").required().messages({
    "string.empty": "Status is required",
    "any.only": "Status must be paid",
    "any.required": "Status is required",
  }),
  note: Joi.string().trim().empty("").default(null).optional(),
  or_number: Joi.string()
    .trim()
    .max(255)
    .when("status", {
      is: "paid",
      then: Joi.required().messages({
        "string.empty": "OR number is required when marking as paid",
        "any.required": "OR number is required when marking as paid",
      }),
      otherwise: Joi.optional(),
    }),
});

function validateApprovePayment(req, res, next) {
  // 🔹 Validate body first
  const { error, value } = updateRequestStatusSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  // 🔹 File validation
  const files = req.files || [];

  // Only enforce proofs when marking as PAID
  if (value.status === "paid") {
    // ❌ No files uploaded
    if (files.length === 0) {
      return res.status(400).json({
        message: "At least 1 proof image is required",
      });
    }

    // ❌ More than 3 files (extra safety, multer already limits this)
    if (files.length > 3) {
      return res.status(400).json({
        message: "Maximum of 3 proof images allowed",
      });
    }

    // ❌ Invalid file type (double check)
    const invalidFile = files.find(
      (file) => !file.mimetype.startsWith("image/"),
    );

    if (invalidFile) {
      return res.status(400).json({
        message: "Only image files are allowed",
      });
    }
  }

  req.body = value;

  next();
}

const reviewSchema = Joi.object({
  status: Joi.string().valid("invoiced", "balance_due").required().messages({
    "any.only": "Status must be invoiced or balance_due",
  }),
  note: Joi.when("status", {
    is: "balance_due",
    then: Joi.string().trim().required().messages({
      "any.required": "Remarks/Reason is needed",
      "string.empty": "Remarks/Reason is needed",
    }),
    otherwise: Joi.string().trim().allow("", null).optional(),
  }),
});

function validateUpdateToReview(req, res, next) {
  const { error, value } = reviewSchema.validate(req.body, {
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
  validateApprovePayment,
  validateUpdateToReview,
};
