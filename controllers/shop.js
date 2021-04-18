const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');

exports.addItemToCart = (req, res, next) => {
    console.log(req.user);
    const cart = new Cart({
        user: req.user,
        cartItems: {
          product: req.body.product,
          quantity: req.body.quantity,
          price: req.body.price  
        }
    });

    cart.save((error, cart) => {
        if(error) return res.status(400).json({ message: "something wrong", error });
        if(cart) {
            return res.status(201).json({ 
                message: 'Item added successfully into your cart',
                user: cart.user._id,
                pId: cart.cartItems.product,
                cid: cart._id,
                qty: cart.cartItems.quantity,
                prc: cart.cartItems.price
             });
        }
    });    
}

exports.getProductIndex = (req, res, next) => {
    res.send('hello from express');
    console.log(req.session);
    console.log(req.user);
    return res.status(200).json({
        user: req.user,
        message: "Users access cart item"
    });
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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId).then(product => {
        //console.log(product);
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: 'Product not found!'});
        }
    })
}

exports.getProductById = (req, res, next) => {
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
        Cart.find()
        .populate('cartItems.product')        
        .then(products => { 
            console.log(products);       
            res.status(200).json({
                message: "Product Fetch from Cart Successfully",
                products: products,
                //catName: products.category
            });
            //console.log(catName);
        });        
    }
    // req.user
    // .populate('cart.cartItems.product')
    // .execPopulate()
    // .then(user => {
    //     const products = user.cart.items;
    //     res.render('products/cart', { 
    //         title: 'product Cart',
    //         products: products            
    //     });
    // })
    // .catch(err => console.log(err));
//}

exports.postProductCart = (req, res, next) => { 

        // const productId = req.body.productId;
        // Product.findById(productId)
        // .then(product => {
        //     console.log(product);
        //     return req.user.addToCart(product);
        // })
        // .then(result => {
        //     console.log(result);
        //     //res.redirect('/cart');
        // });    
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
            //console.log('Order Canceled');
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteOrderDetails = (req, res, next) => {
    Order.find({ 'orders.products': req.order.products._id })
    .then(products => {
        //console.log(products);
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