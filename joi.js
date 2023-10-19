const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Joi = require('joi');

const app = express();

app.use([morgan('dev'), cors(), express.json()]);

//post schema
const schema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.base': 'name must be string',
    'string.min': 'minimum length 3',
    'string.max': 'max length 5',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'info'] },
    })
    .normalize()
    .custom((value) => {
      if (value === 'test@gmail.com') {
        throw new Error('email already in use');
      }
      return value;
    })
    .required()
    .messages({
      'any.custom': 'email already in use',
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
      )
    )
    .required()
    .messages({
      'string.pattern.base':
        'password must contain uppercase, lowercase, digit and special chars',
    }),
  confirmPassword: Joi.ref('password'),
  bio: Joi.string().trim().min(20).max(300),
  addresses: Joi.array().items(
    Joi.object({
      city: Joi.string(),
      postcode: Joi.number(),
    })
  ),
  skills: Joi.string()
    .trim()
    .custom((value) => {
      return value.split(',').map((item) => item.trim());
    }),
});

// handle registration
app.post('/', (req, res) => {
  const result = schema.validate(req.body, { abortEarly: false });

  if (result.error) {
    console.log(result.error.details);

    const errors = result.error.details.reduce((acc, cur) => {
      acc[cur.path[0]] = cur.message;
      return acc;
    }, {});

    return res.status(400).json(errors);
  }
  console.log(result.value);

  res.status(201).json({ message: 'Ok' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
