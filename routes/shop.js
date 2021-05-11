var express = require('express');
var router = express.Router();

const checkAuth = require('../middleware/auth');

const productsController = require('../controllers/shop');

/* GET home page. */
router.get('/', isValidUser, productsController.getProductIndex );

/* GET allproducts page. */
//router.get('/products', productsController.getAllProducts);

/* GET product-details page */
router.get('/product/details/:id', productsController.getProduct);

/* GET Cart page */
router.get('/cart', productsController.getProductCart);

/* POST add to Cart */
router.post('/api/cart', checkAuth, productsController.addItemToCart);

/* POST Delete Cart Items */
router.delete('/api/cart/delete/:cartId', checkAuth, productsController.postCartDeleteProduct);

/* GET Cart page */
router.get('/wish', productsController.getProductWish);

/* POST add to Cart */
router.post('/api/wish', checkAuth, productsController.addItemToWishlist);

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
    if(req.isAuthenticated()) { 
    next();    
} 
    return res.status(401).json({ message: 'Unauthorized Request'});
}

module.exports = router;
