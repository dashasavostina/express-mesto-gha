const router = require('express').Router();
const { userIdValidate, avatarUpdateValidatin, userUpdateValidation } = require('../middlewares/validationJoi');

const {
  getUser,
  findUsers,
  findUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.get('/users', findUsers);
router.get('/users/:userId', userIdValidate, findUserById);
router.patch('/users/me', userUpdateValidation, updateProfile);
router.patch('/users/me/avatar', avatarUpdateValidatin, updateAvatar);

module.exports = router;
