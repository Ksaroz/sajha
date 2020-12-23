var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admin');

/* GET addProducts page */
//router.get('/add', adminController.getAddProduct);

/* POST addProducts */
router.post('/add', adminController.postAddProduct);

/* POST addCategory */
router.post('/add/category', adminController.postAddCategory);

/* GET AllProducts for admin */
router.get('/products', adminController.getAllProducts);

/* GET AllCategories for admin */
router.get('/add/category', adminController.getAllCategories);

/* GET Edit Products for admin */
router.get('/product/update/:id', adminController.getEditProducts);

/* GET Edit Categories for admin */
router.get('/add/category/update/:id', adminController.getEditCategories);

/* PUT Edit Categories for admin */
router.put('/add/category/update/:id', adminController.putEditCategories);

/* POST Edit Products by admin */
//router.post('/edit', adminController.postEditProducts);

/* POST Delete Products by admin */
router.delete('/product/delete/:id', adminController.deleteProduct);

/* POST Delete Categories by admin */
router.delete('/add/category/delete/:id', adminController.deleteCategory);

/* GET Order page */
//router.get('/orders', adminController.getOrders);


module.exports = router;