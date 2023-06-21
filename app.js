const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT, () => {
  console.log('Всё чётко');
});

app.use((req, res, next) => {
  req.user = {
    _id: '648f4ad2d9fecc9c025fe0d1',
  };

  next();
});

app.use(routeUser);
app.use(routeCard);
