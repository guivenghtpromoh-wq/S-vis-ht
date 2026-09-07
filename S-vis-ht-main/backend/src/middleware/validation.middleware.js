const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: 'Done ou voye yo pa valid', details });
    }
    next();
  };
};

// Yon ti schema senp si Joi/Zod pa la pou evite krik
const dummySchema = {
  validate: () => ({ error: null })
};

const serviceSchema = dummySchema;
const messageSchema = dummySchema;

module.exports = {
  validate,
  serviceSchema,
  messageSchema,
};
