var express = require('express');
var router = express.Router();

const userController = require('../controllers/user')

router.post('/signup', userController.postSignUp);
router.post('/login',  userController.postLogin);

router.get('/logout', userController.getLogout);

module.exports = router;
