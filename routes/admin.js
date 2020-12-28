var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admin');

/* GET addProducts page */
//router.get('/add', adminController.getAddProduct);

/* POST addProducts */
router.post('/add', adminController.postAddProduct);

/* POST addCategory */
router.post('/add/category', adminController.postAddCategory);

/* POST addAttribute */
router.post('/add/attribute', adminController.postAddAttribute);

/* GET AllProducts for admin */
router.get('/products', adminController.getAllProducts);

/* GET AllCategories for admin */
router.get('/add/category', adminController.getAllCategories);

/* GET AllAttributes for admin */
router.get('/add/attribute', adminController.getAllAttributes);

/* GET Edit Products for admin */
router.get('/product/update/:id', adminController.getEditProducts);

/* PUT Edit Products for admin */
router.put('/product/update/:id', adminController.putEditProducts);

/* GET Edit Categories for admin */
router.get('/add/category/update/:id', adminController.getEditCategories);

/* PUT Edit Categories for admin */
router.put('/add/category/update/:id', adminController.putEditCategories);

/* GET Edit Attributes for admin */
router.get('/add/attribute/update/:id', adminController.getEditAttributes);

/* PUT Edit Attributes for admin */
router.put('/add/attribute/update/:id', adminController.putEditAttributes);

/* POST Edit Products by admin */
//router.post('/edit', adminController.postEditProducts);

/* POST Delete Products by admin */
router.delete('/product/delete/:id', adminController.deleteProduct);

/* POST Delete Categories by admin */
router.delete('/add/category/delete/:id', adminController.deleteCategory);

/* POST Delete Attributes by admin */
router.delete('/add/attribute/delete/:id', adminController.deleteAttribute);

/* GET Order page */
//router.get('/orders', adminController.getOrders);


module.exports = router;