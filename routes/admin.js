var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admin');

/* GET addProducts page */
router.get('/add', adminController.getAddProduct);

/* POST addProducts */
router.post('/add', adminController.postAddProduct);

/* GET AllProducts for admin */
router.get('/products', adminController.getAllProducts);

/* GET Edit Products for admin */
router.get('/edit/:productId', adminController.getEditProducts);

/* POST Edit Products by admin */
router.post('/edit', adminController.postEditProducts);

/* POST Delete Products by admin */
router.post('/delete', adminController.postDeleteProduct);

/* GET Order page */
router.get('/orders', adminController.getOrders);


module.exports = router;