const Card = require('../models/card');
const { ERROR_CODE_INVALID, ERROR_CODE_NOTFOUND, ERROR_CODE_DEFAULT } = require('../utils/status-code');

module.exports.createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Передан несуществуюий id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Передан несуществуюий id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};
