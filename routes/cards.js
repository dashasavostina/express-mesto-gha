const router = require('express').Router();

const { createCardValidation, cardValidation } = require('../middlewares/validationJoi');

const { createCard } = require('../controllers/cards');
const { findCards } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { likeCard } = require('../controllers/cards');
const { dislikeCard } = require('../controllers/cards');

router.post('/cards', createCardValidation, createCard);
router.get('/cards', findCards);
router.delete('/cards/:cardId', cardValidation, deleteCard);
router.put('/cards/:cardId/likes', cardValidation, likeCard);
router.delete('/cards/:cardId/likes', cardValidation, dislikeCard);

module.exports = router;
