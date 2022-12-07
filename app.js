const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const auth = require('./auth');
const User = require('./db/userModel');
const ROLES = require('./helpers/role');
const codeBlocksList = require('./data/codeBlocks');
const { findAllStudents } = require('./controllers/users');
dbConnect();

// Hanling cors errors
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

const { response } = require('express');
// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
  response.json({ message: 'Hey! This is your server response!' });
  next();
});

app.post('/register', (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        username: request.body.username,
        password: hashedPassword,
        role: request.body.role,
      });
      //validate if username is already exict.
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: 'User Created Successfully',
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: 'Error creating user',
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: 'failed to hased the password',
        e,
      });
    });
});

// login endpoint
app.post('/login', (request, response) => {
  // check if username exists
  User.findOne({ username: request.body.username })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)

        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: 'Passwords does not match',
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userUsername: user.username,
              role: user.role,
            },
            'RANDOM-TOKEN',
            { expiresIn: '24h' }
          );

          //   return success response
          response.status(200).send({
            message: 'Login Successful',
            username: user.username,
            role: user.role,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: 'Passwords does not match',
            error,
          });
        });
    })
    // catch error if username does not exist
    .catch((e) => {
      response.status(404).send({
        message: 'Username not found',
        e,
      });
    });
});

// authentication code blocks endpoint
app.get('/code-blocks', auth, (request, response) => {
  console.log({ user: request.user });
  const { user } = request;
  if (user?.role !== ROLES.MENTOR) {
    response.status(401).send({ message: 'User role is invalid' });
  }
  console.log({ codeBlocksList });
  response.json({ codeBlocksList });
});

// mentor get students list
app.get('/students', auth, async (request, response) => {
  console.log({ user: request.user });
  const { user } = request;
  if (user?.role !== ROLES.MENTOR) {
    response.status(401).send({ message: 'User role is invalid' });
  }
  const users = await findAllStudents();
  console.log({ users });
  response.json({ users });
});

module.exports = app;
