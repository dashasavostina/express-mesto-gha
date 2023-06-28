const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { ERROR_CODE_NOTFOUND } = require('./utils/status-code');

const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { createUserValidation, loginValidation } = require('./middlewares/validationJoi');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT);

app.use(routeUser);
app.use(routeCard);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.patch('*', (req, res) => res.status(ERROR_CODE_NOTFOUND).send({ message: 'Страница не найдена' }));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
