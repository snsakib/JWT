const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

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
    res.status(201).send(users);
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
      res.send('Success');
    } else {
      res.send('Not allowed');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(3000);