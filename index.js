const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//import for json schema
// const Ajv = require('ajv');

//import for json type def
const Ajv = require('ajv/dist/jtd');

const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const app = express();

app.use([morgan('dev'), cors(), express.json()]);

// handle registration
app.post('/', (req, res) => {
  //validate for json schema
  // const validate = ajv.compile(require('./registration.schema.json'));

  //validate for json type def
  const validate = ajv.compile(require('./registration.jtd.json'));

  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);
    return res.status(400).json(validate.errors);
  }

  res.status(201).json({ message: 'Ok' });
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
