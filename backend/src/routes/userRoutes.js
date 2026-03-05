const express = require('express');
const { register, userLogin, userLogout, getMe, updateProfile, changePassword } = require('../controllers/userController');
const { userGuard } = require('../middleware/userAuthMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.get('/me', userGuard, getMe);
router.put('/me', userGuard, updateProfile);
router.put('/me/password', userGuard, changePassword);

module.exports = router;
