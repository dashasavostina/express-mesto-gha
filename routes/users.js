const router = require('express').Router();

const { createUser } = require('../controllers/users');
const { findUsers } = require('../controllers/users');
const { findUserById } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', findUsers);
router.get('/users/:userId', findUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
