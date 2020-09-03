var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account')

/* GET home page. */
router.get('/', accountController.getAccount);

module.exports = router;
