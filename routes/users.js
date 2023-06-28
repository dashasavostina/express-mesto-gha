const router = require('express').Router();

const {
  getUser,
  findUsers,
  findUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.get('/users', findUsers);
router.get('/users/:userId', findUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
