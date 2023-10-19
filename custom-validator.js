const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const validator = require('validator');

const app = express();

app.use([morgan('dev'), cors(), express.json()]);

const people = {
  rezuan: {
    firsName: 'Rezuan',
    lastName: 'Ahmed',
    email: 'rezuan@gmail.com',
  },
  papiya: {
    firsName: 'papiya',
    lastName: 'Akter',
    email: 'papiya@gmail.com',
  },
};

app.get('/', (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      err: 'Bad Request',
      message: 'Username is missing on query parameter',
    });
  }

  res.status(200).json(people[username.toLocaleLowerCase()]);
});

app.post('/', (req, res) => {
  const { name, username, email } = req.body;
  console.log(name);

  if (!name) {
    return res
      .status(400)
      .json({ err: 'Bad Request', message: 'name is missing' });
  }
  if (!username) {
    return res
      .status(400)
      .json({ err: 'Bad Request', message: 'username is missing' });
  }
  if (!email) {
    return res
      .status(400)
      .json({ err: 'Bad Request', message: 'email is missing' });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ err: 'Bad Request', message: 'Invalid email' });
  }

  const names = name.split(' ');
  const firsName = names[0];
  const lastName = names[1] || '';

  people[username.toString()] = {
    firsName,
    lastName,
    email,
  };
  res.status(201).json(people[username.toString()]);
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
