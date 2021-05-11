const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Wish = require('../models/wish');

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

exports.addItemToWishlist = (req, res, next) => {
    console.log(req.user);
    const wish = new Wish({ 
        user: req.user,
        wishItems: {
          product: req.body.product,
          quantity: req.body.quantity,
          price: req.body.price  
        }
    });

    wish.save((error, wish) => {
        if(error) return res.status(400).json({ message: "something wrong", error });
        if(wish) {            
            return res.status(201).json({ 
                message: 'Item added successfully into your Wishlist',
                user: wish.user._id,
                pId: wish.wishItems.product,
                cid: wish._id,
                qty: wish.wishItems.quantity,
                prc: wish.wishItems.price
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
    const prodId = req.params.productId;
    Product.findById(prodId)
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
    // const cartId = req.params.id;
    // Cart.deleteOne({ _id: cartId })
    // .then(() => {        
    //     res.status(200).json({message: 'Cart Item has been Deleted!'});        
    // });
    console.log(req.user);
    if(req.user) {
        const cartId = req.params.cartId;
        console.log(cartId);
        Cart.findByIdAndRemove(cartId)
        .then(result => {
            //console.log('Order Canceled');
            res.status(200).json({message: 'Cart Item has been Deleted!'});        
            //res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        res.status(400).json({message: 'Sorry user is unauthorized!'});
    }

    // const id = req.params.id;
    // console.log(id);
    // Cart.findByIdAndRemove(id)
    //     .then(result => {
    //         //console.log('Order Canceled');
    //         return res.status()
    //         res.redirect('/orders');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // req.cart
    //     .removeFromCart(id)
    //     .then(result => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
}

exports.getProductWish = (req, res, next) => {    
    Wish.find()
    .populate('wishItems.product')        
    .then(products => { 
        console.log(products);       
        res.status(200).json({
            message: "Product Fetch from Wishlist Successfully",
            products: products,
            //catName: products.category
        });
        //console.log(catName);
    });        
}

exports.deleteWishProduct = (req, res, next) => {
    // const cartId = req.params.id;
    // Cart.deleteOne({ _id: cartId })
    // .then(() => {        
    //     res.status(200).json({message: 'Cart Item has been Deleted!'});        
    // });
    console.log(req.user);
    if(req.user) {
        const wishId = req.params.wishId;
        console.log(wishId);
        Wish.findByIdAndRemove(wishId)
        .then(result => {            
            res.status(200).json({message: 'Wish Item has been Deleted!'});            
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        res.status(400).json({message: 'Sorry user is unauthorized!'});
    }    
}

// exports.deleteWishProduct = (req, res, next) => {
//     const wishId = req.params.id;
//     Wish.deleteOne({ _id: wishId })
//     .then(() => {        
//         res.status(200).json({message: 'Wish Deleted!'});        
//     });    
// }

exports.getMyOrders = (req, res, next) => {
    Order.find()
        .populate('cartId')
        .populate('')        
        .then(orders => { 
            console.log(orders);       
            res.status(200).json({
                message: "Product Fetch from Order Successfully",
                products: orders,
                //catName: products.category
            });
            //console.log(catName);
        });       
};

exports.postOrder = (req, res, next) => {
    console.log(req.user);
    const order = new Order({        
        user: req.user._id,
        orderItems: {
            cart: req.body.orderItems.cart,
            product: req.body.orderItems.product
        }
    });
    order.save((error, order) => {
        if(error) return res.status(400).json({ message: "something wrong", error });
        if(order) {
            console.log(order);
            return res.status(201).json({ 
                message: 'Your order has been successfully placed',
                oId: order._id,
                user: order.user._id,
                cId: order.orderItems.cart,
                pId: order.orderItems.product
             });
        }
    });    
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