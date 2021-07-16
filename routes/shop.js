var express = require('express');
var router = express.Router();

const checkAuth = require('../middleware/auth');

const productsController = require('../controllers/shop');

/* GET home page. */
router.get('/', productsController.getProductIndex );

/* GET allproducts page. */
//router.get('/products', productsController.getAllProducts);

/* GET product-details page */
router.get('/api/products/details/:id', productsController.getProductById);

/* GET product-by-category page */
router.get('/api/products/category/:id', productsController.getProductByCatId);

/* GET Cart page */
router.get('/api/cart', productsController.getProductCart);

/* POST add to Cart */
router.post('/api/cart', checkAuth, productsController.addItemToCart);

/* POST Cart quantity to increase*/
router.post('/api/cart/qty/inc', checkAuth, productsController.cartQtyIncrease);

/* POST Cart quantity to decrease */
router.post('/api/cart/qty/dec', checkAuth, productsController.cartQtyDecrease);

/* POST Delete Cart Items */
router.delete('/api/cart/delete/:cartId', checkAuth, productsController.postCartDeleteProduct);

/* GET Cart page */
router.get('/api/wish', productsController.getProductWish);

/* POST add to Cart */
router.post('/api/wish', checkAuth, productsController.addItemToWishlist);

/* POST wish quantity to increase*/
router.post('/api/wish/qty/inc', checkAuth, productsController.wishQtyIncrease);

/* POST wish quantity to decrease */
router.post('/api/wish/qty/dec', checkAuth, productsController.wishQtyDecrease);

/* POST Delete Cart Items */
router.delete('/api/wish/delete/:wishId', checkAuth, productsController.deleteWishProduct);

/* POST Place Orders */
router.post('/api/orders', checkAuth, productsController.postOrder);

/* GET Order page */
router.get('/api/orders', productsController.getMyOrders);

/* GET order-details page */
//router.get('/orders/details/:orderId', productsController.getOrderDetails);

/* POST Delete Cart Items */
//router.post('/orders/details/delete', productsController.postDeleteOrderDetails);

/* POST Delete Orders */
//router.post('/orders/delete', productsController.postDeleteOrder);

/* GET About page */
//router.get('/about', productsController.getAboutPage);

function isValidUser(req, res, next) {
    if(req.isAuthenticated()) next();     
    else return res.status(401).json({ message: 'Unauthorized Request'});
}

module.exports = router;
