var express = require('express');
var router = express.Router();

const productsController = require('../controllers/shop');

/* GET home page. */
router.get('/', productsController.getProductIndex );

/* GET allproducts page. */
//router.get('/products', productsController.getAllProducts);

/* GET product-details page */
//router.get('/details/:productId', productsController.getProductDetails);

/* GET Cart page */
//router.get('/cart', productsController.getProductCart);

/* POST add to Cart */
//router.post('/cart', productsController.postProductCart);

/* POST Delete Cart Items */
//router.post('/cart/delete', productsController.postCartDeleteProduct);

/* POST Place Orders */
//router.post('/orders', productsController.postOrder);

/* GET Order page */
//router.get('/orders', productsController.getMyOrders);

/* GET order-details page */
//router.get('/orders/details/:orderId', productsController.getOrderDetails);

/* POST Delete Cart Items */
//router.post('/orders/details/delete', productsController.postDeleteOrderDetails);

/* POST Delete Orders */
//router.post('/orders/delete', productsController.postDeleteOrder);

/* GET About page */
//router.get('/about', productsController.getAboutPage);


module.exports = router;
