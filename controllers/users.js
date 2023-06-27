const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_INVALID,
  ERROR_CODE_NOTFOUND,
  ERROR_CODE_DEFAULT,
  SUCCESS,
} = require('../utils/status-code');

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
          return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при создании пользователя' });
        }
        return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
      }));
};

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.findUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      if (!users) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!userId) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!userId) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
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
