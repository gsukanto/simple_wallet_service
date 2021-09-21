import Joi from "@hapi/joi";

export const depositSchema = Joi.object({
  amount: Joi.number()
                  .greater(10000)
                  .integer()
                  .required(),
  reference_id: Joi.string()
                  .min(1)
                  .max(100)
                  .required(),
});

export const withdrawalSchema = Joi.object({
  amount: Joi.number()
                  .greater(10000)
                  .integer()
                  .required(),
  reference_id: Joi.string()
                  .min(1)
                  .max(100)
                  .required(),
});