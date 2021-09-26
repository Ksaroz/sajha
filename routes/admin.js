const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const checkAuth = require('../middleware/auth');
const adminController = require('../controllers/admin');

const productController = require('../controllers/product');
const categoryController = require('../controllers/category');
const attributeController = require('../controllers/attribute');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid Mime Type");
      if(isValid) {
        error = null;
      }
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + shortid.generate() + '-' + Date.now() + '.' + ext);
    }
})

const upload = multer({ storage });

///////////////////////*Routes for products*//////////////////////////

/* GET AllProducts for admin */
router.get('/product', productController.getAllProducts);

/* GET single Product for admin */
router.get('/product/:id', productController.getProduct);

/* POST new product */
router.post('/product/new', checkAuth, upload.array('image'), productController.postAddProduct); 

/* PUT Edit Products for admin */
router.put('/product/update/:id', checkAuth, upload.array('image'), adminController.putEditProducts);

/* POST Delete Products by admin */
router.delete('/product/delete/:id', checkAuth, productController.deleteProduct);

////////////////////////*end of product routes*///////////////////////


//////////////////////*Routes for categories*//////////////////////////////

/* GET AllCategories for admin */
router.get('/category', categoryController.getAllCategories);

/* GET category for update */
router.get('/category/:id', categoryController.getCategory);

/* POST addCategory */
router.post('/category', checkAuth, categoryController.postAddCategory);

/* PUT category for update */
router.put('/category/update/:id', checkAuth, adminController.putEditCategories);

/* POST Delete Category by admin */
router.delete('/category/delete/:id', checkAuth, categoryController.deleteCategory);

/////////////////////////////*end of categories routes*///////////////////////


//////////////////////*Routes for attributes*//////////////////////////////

/* GET AllAttributes for admin */
router.get('/attribute', attributeController.getAllAttributes);

/* GET Edit Attributes for admin */
router.get('/attribute/:id', attributeController.getEditAttributes);

/* POST addAttribute */
router.post('/attribute', checkAuth, attributeController.postAddAttribute);

/* PUT Edit Attributes for admin */
router.put('/attribute/update/:id', checkAuth, adminController.putEditAttributes);

/* POST Delete Attributes by admin */
router.delete('/attribute/delete/:id', checkAuth, attributeController.deleteAttribute);

/////////////////////////////*end of attributes routes*///////////////////////


//////////////////////*Routes for Users*//////////////////////////

/* GET Allusers for admin */
router.get('/users', adminController.getAllUsers);

/* POST addUser */
router.post('/user/new', checkAuth, adminController.postAddUser);

/* POST Delete Products by admin */
router.delete('/user/delete/:id', checkAuth, adminController.deleteUser);

//////////////*end of user routes*///////////////////////////

/* POST Edit Products by admin */
//router.post('/edit', adminController.postEditProducts);

/* GET Order page */
//router.get('/orders', adminController.getOrders);

module.exports = router;