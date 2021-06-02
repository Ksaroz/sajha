const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const checkAuth = require('../middleware/auth');
const adminController = require('../controllers/admin');

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

/* GET addProducts page */
//router.get('/add', adminController.getAddProduct);

/* POST addUser */
router.post('/add/user', checkAuth, adminController.postAddUser);

/* POST addProducts */
router.post('/add/product', checkAuth, upload.array('image'), adminController.postAddProduct); 

/* POST addCategory */
router.post('/add/category', checkAuth, adminController.postAddCategory);

/* POST addAttribute */
router.post('/add/attribute', checkAuth, adminController.postAddAttribute);

/* GET Allusers for admin */
router.get('/users', adminController.getAllUsers);

/* GET AllProducts for admin */
router.get('/products', adminController.getAllProducts);

/* GET AllCategories for admin */
router.get('/add/category', adminController.getAllCategories);

/* GET AllAttributes for admin */
router.get('/add/attribute', adminController.getAllAttributes);

/* GET Edit Products for admin */
router.get('/api/product/:id', adminController.getProduct);

/* GET Edit Products for admin */
router.get('/product/update/:id', adminController.getProduct);

/* PUT Edit Products for admin */
router.put('/product/update/:id', checkAuth, upload.array('image'), adminController.putEditProducts);

/* GET Edit Categories for admin */
router.get('/add/category/update/:id', adminController.getEditCategories);

/* PUT Edit Categories for admin */
router.put('/add/category/update/:id', checkAuth, adminController.putEditCategories);

/* GET Edit Attributes for admin */
router.get('/add/attribute/update/:id', adminController.getEditAttributes);

/* PUT Edit Attributes for admin */
router.put('/add/attribute/update/:id', checkAuth, adminController.putEditAttributes);

/* POST Edit Products by admin */
//router.post('/edit', adminController.postEditProducts);

/* POST Delete Products by admin */
router.delete('/user/delete/:id', checkAuth, adminController.deleteUser);

/* POST Delete Products by admin */
router.delete('/product/delete/:id', checkAuth, adminController.deleteProduct);

/* POST Delete Categories by admin */
router.delete('/add/category/delete/:id', checkAuth, adminController.deleteCategory);

/* POST Delete Attributes by admin */
router.delete('/add/attribute/delete/:id', checkAuth, adminController.deleteAttribute);

/* GET Order page */
//router.get('/orders', adminController.getOrders);


module.exports = router;