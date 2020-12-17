const Product = require('../models/product');
const Order = require('../models/order');

exports.getProductIndex = (req, res, next) => {
    res.send('hello from express');
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('products/all-products', {
            prods: products,
            title: 'All products',
            path: '/admin/add'            
        });
    })
    
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render('products/details', { 
            title: 'product Details',
            product: product,
            path: '/details'            
        });
    });
}


exports.getProductCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items;
        res.render('products/cart', { 
            title: 'product Cart',
            products: products            
        });
    })
    .catch(err => console.log(err));
}

exports.postProductCart = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/login');
    } else {
        const productId = req.body.productId;
        Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            //console.log(result);
            res.redirect('/cart');
        });
    }
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getMyOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
        res.render('products/order', {
            title: 'My Orders',
            path: '/orders',
            orders: orders            
        });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
    });
    order.save();
    })
    .then(result => {
        return req.user.clearCart();        
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrderDetails = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(orders => {
        res.render('products/order-details', { 
            title: 'Order Details',
            orders: orders,
            path: '/orders/details'            
        });
    });
}

exports.postDeleteOrder = (req, res, next) => {
    const orderId = req.body.orderId;
    Order.findByIdAndRemove(orderId)
        .then(result => {
            console.log('Order Canceled');
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteOrderDetails = (req, res, next) => {
    Order.find({ 'orders.products': req.order.products._id })
    .then(products => {
        console.log(products);
        const productId = req.body.productId;
        products.product.findByIdAndRemove(productId)
    })
    .then(result => {
        //const orderId = req.params.orderId;
        console.log('Order Item Deleted');
        res.redirect('/orders');
    })
    .catch(err => {
        console.log(err);
    });
}


exports.getAboutPage = (req, res, next) => {
    res.render('about/about', { 
        title: 'About Us'        
    }); 
}