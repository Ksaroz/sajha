var express = require('express');
var router = express.Router();

const checkAuth = require('../middleware/auth');

const productsController = require('../controllers/shop');
const homeController = require('../controllers/home');
const productController = require('../controllers/product');
const cartController = require('../controllers/cart');
const wishController = require('../controllers/wish');

////////////////*Routers for guest*////////////////////

/* GET home page. */
router.get('/', homeController.getProductIndex );


///////////////*Products*//////////////////////////////


/* GET allproducts page. */
router.get('/products', productController.getAllProducts);

/* GET product-details page */
router.get('/products/details/:id', productController.getProduct);

/* GET product-by-category page */
router.get('/products/category/:id', productController.getProductByCatId);

////////////////*end of product routes*/////////////////////////

//////////////*Carts*//////////////////////////

/* GET Cart page */
router.get('/cart', cartController.getProductCart);

/* POST add to Cart */
router.post('/cart', checkAuth, cartController.addItemToCart);

/* POST Delete Cart Items */
router.delete('/cart/delete/:pId', checkAuth, productsController.postCartDeleteProduct);

/* POST Cart quantity to increase*/
router.post('/cart/qty/inc', checkAuth, productsController.cartQtyIncrease);

/* POST Cart quantity to decrease */
router.post('/cart/qty/dec', checkAuth, productsController.cartQtyDecrease);

////////////////////////*end of cart routes*///////////////////////////////

////////////////////*Wishes*//////////////////////////////////

/* GET Cart page */
router.get('/wish', wishController.getProductWish);

/* POST add to Cart */
router.post('/wish', checkAuth, wishController.addItemToWishlist);

/* POST Delete Cart Items */
router.delete('/wish/delete/:pId', checkAuth, wishController.deleteWishProduct);

/* POST wish quantity to increase*/
router.post('/wish/qty/inc', checkAuth, productsController.wishQtyIncrease);

/* POST wish quantity to decrease */
router.post('/wish/qty/dec', checkAuth, productsController.wishQtyDecrease);

//////////////////////////*end of wish routes*////////////////////////////

////////////////////*Orders*///////////////////////////

/* POST Place Orders */
router.post('/orders', checkAuth, productsController.postOrder);

/* GET Order page */
router.get('/orders', productsController.getMyOrders);

/* GET order-details page */
//router.get('/orders/details/:orderId', productsController.getOrderDetails);

/* POST Delete Cart Items */
//router.post('/orders/details/delete', productsController.postDeleteOrderDetails);

/* POST Delete Orders */
//router.post('/orders/delete', productsController.postDeleteOrder);

///////////////////////*end of order routes*///////////////////////

/* GET About page */
//router.get('/about', productsController.getAboutPage);

// function isValidUser(req, res, next) {
//     if(req.isAuthenticated()) next();     
//     else return res.status(401).json({ message: 'Unauthorized Request'});
// }

module.exports = router;
