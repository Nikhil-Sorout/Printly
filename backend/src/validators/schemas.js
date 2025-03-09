import Joi from 'joi';

export const itemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
});

export const transactionSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      item_id: Joi.number().required(),
      quantity: Joi.number().integer().positive().required()
    })
  ).required(),
  // customer_id: Joi.number().optional()
});

export const customerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}); 

export const signUpSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
}); 