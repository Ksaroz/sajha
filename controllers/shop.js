const Product = require('../models/product');
const Order = require('../models/order');

exports.getProductIndex = (req, res, next) => {
    res.render('index', { title: 'Shop' });
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('products/allproducts', {
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
        res.render('products/detail', { 
            title: 'product Details',
            product: product,
            path: '/details'
        });

    })
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
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    });
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
                name: req.user.name,
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


exports.getAboutPage = (req, res, next) => {
    res.render('about/about', { title: 'About Us'}); 
}