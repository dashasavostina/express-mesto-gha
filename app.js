const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { ERROR_CODE_NOTFOUND } = require('./utils/status-code');

const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT);

app.use(routeUser);
app.use(routeCard);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.use('/cards', require('./routes/cards'));

app.patch('*', (req, res) => res.status(ERROR_CODE_NOTFOUND).send({ message: 'Страница не найдена' }));
