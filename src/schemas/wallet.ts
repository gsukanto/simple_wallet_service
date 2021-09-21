import Joi from "@hapi/joi";

export const patchWalletSchema = Joi.object({
  is_disabled: Joi.string()
                  .valid("true")
                  .required(),
});

export const initWalletSchema = Joi.object({
  customer_xid: Joi.string()
                    .min(1)
                    .max(100)
                    .required(),
});
