const BadRequestError = require('../middlewares/errors/bad-request-err');
const Card = require('../models/card');
const NotFoundError = require('../middlewares/errors/not-found-err');
const ForbiddenError = require('../middlewares/errors/forbidden-err');

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.findCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не являетесь владельцем карточки, удаление невозможно'));
      }
      return Card.findByIdAndDelete(cardId)
        .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
        .then(() => {
          res.send({ message: 'Карточка успешна удалена' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществуюий id карточки'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществуюий id карточки'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка карточки.'));
      } else {
        next(err);
      }
    });
};
