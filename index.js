const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();

app.use([morgan('dev'), cors(), express.json()]);

const reqBodyValidator = [
  body('name')
    .trim()
    .isString()
    .withMessage('name must be a valid string')
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage('name length must be between 5 - 30 chars'),
  body('email')
    .normalizeEmail({ all_lowercase: true })
    .isEmail()
    .withMessage('please provide a valid email')
    .bail()
    .custom((value) => {
      if (value === 'rezuan@gmail.com') {
        throw new Error('email already used');
      }
      return true;
    }),
  body('password')
    .isString()
    .withMessage('password must be a valid string')
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage('length should 8-30 chars')
    .bail()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      'password must contain uppercase, lowercase, digit, and special chars'
    ),
  body('confirmPassword')
    .isString()
    .withMessage('confirm password must be a valid string')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password does not match');
      }
      return true;
    }),
  body('bio')
    .optional()
    .trim()
    .escape()
    .isString()
    .isLength({ min: 20, max: 300 })
    .withMessage('bio must be between 20-300 chars'),
  body('addresses')
    .optional()
    .custom((v) => {
      if (!Array.isArray(v)) {
        throw new Error('addresses must be an array of addresses');
      }
      return true;
    }),
  body('addresses.*.postcode')
    .optional()
    .isNumeric()
    .withMessage('postcode must be numeric')
    .toInt(),
  body('skills')
    .optional()
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage('skills must be a comma separated string')
    .customSanitizer((v) => {
      return v.split(',').map((item) => item.trim());
    }),
];

const validate = (req, res, next) => {
  const errorFormatter = (error) => {
    return `${error.path}: ${error.msg}`;
  };

  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};

app.post('/', reqBodyValidator, validate, (req, res) => {
  res.status(201).json({ message: 'Ok' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});

const reqBody = {
  name: 'Rezuan Ahmed', //required
  email: 'rezuan@gmail.com', //required
  password: '1234', //required
  confirmPassword: '1234', //required
  bio: 'This is my bio',
  addresses: [
    {
      city: 'Tangail',
      postcode: 1900,
    },
    {
      city: 'Dhaka',
      postcode: 1212,
    },
  ],
  skills: 'JS, TS, React, Node',
};
