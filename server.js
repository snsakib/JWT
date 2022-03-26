require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const users = [];

const posts = [
  {
    username: "Sakib",
    title: "Post 1"
  },
  {
    username: "Syed",
    title: "Post 2"
  }
];

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashedPassword
    };
    users.push(user);
    res.status(201).send('Signup Successful!');
  } catch (error) {
    req.send(error);
  }
});

app.post('/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name);
  if(!user) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      const payload = {
        name: req.body.name
      }
      const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      res.json({ token: jwtToken });
    } else {
      res.send('Not allowed');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if(token === null) return res.status(401).send();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.status(403).send();
    req.user = user;
    next();
  })
}

app.listen(3000);