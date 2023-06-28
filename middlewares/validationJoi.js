const { celebrate, Joi, CelebrateError } = require('celebrate');
const regular = /(http?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9\.[^/s]{2,}|http?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^/s]{2,}|www\.[a-zA-Z0-9]+\.[^/s]{2,})/;

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(4),
    email: Joi.string().required().email(),
    password: Joi.string().required.min(8),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required.min(8),
  }),
});

module.exports.userIdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.avatarUpdateValidatin = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(4).pattern(regular),
  }),
});

module.exports.userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regular).required().min(4),
  }),
});

module.exports.cardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
