var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account')

/* GET Login page. */
router.get('/login', accountController.getLogin);

/* POST Login page. */
router.post('/login', accountController.postLogin);

/* POST Logout page. */
router.post('/logout', accountController.postLogout);

module.exports = router;
