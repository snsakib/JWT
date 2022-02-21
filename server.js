const express = require('express');
const app = express();

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

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(3000);