var express = require('express');
var router = express.Router();

const userController = require('../controllers/user')

router.post('/signup', userController.postSignUp);
router.post('/login',  userController.postLogin);

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
