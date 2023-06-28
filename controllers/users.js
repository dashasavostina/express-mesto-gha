const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_INVALID,
  ERROR_CODE_DEFAULT,
  SUCCESS,
} = require('../utils/status-code');
const NotFoundError = require('../middlewares/errors/not-found-err');
const InvalidError = require('../middlewares/errors/invalid-err');
const UnauthorizedError = require('../middlewares/errors/unauthorized-err');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(SUCCESS).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new UnauthorizedError('Переданы некорректные данные при регистрации пользователя');
        }
        return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
      }));
};

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.findUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      return res.send({ data: users });
    })
    .catch(next)
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidError('Переданы некорректные данные при поиске пользователя');
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!userId) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch(next)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!userId) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch(next)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
