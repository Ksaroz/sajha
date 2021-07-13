const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Wish = require('../models/wish');

exports.addItemToCart = (req, res, next) => {    
    Cart.findOne({ user: req.user._id})
    .exec((error, cart) => {
        if(error) return res.status(400).json({ error});
        if(cart) {            
            const product = req.body.cartItems.product;
            //console.log(product);
            const existProduct = cart.cartItems.find(c => c.product == product);
            //console.log(existProduct)
            let condition, update;
            if(existProduct){
                let updatedQty = existProduct.quantity + req.body.cartItems.quantity;
                condition = { "user": req.user._id, "cartItems.product": product  };
                update = {
                    "$set": {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: updatedQty,
                            price: req.body.cartItems.price * updatedQty
                        }
                    }
                };                
            } else {
                condition = { user: req.user._id };
                update = {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }
                };
            }            
            Cart.findOneAndUpdate( condition, update )
            .exec((error, _cart) => {
                if(error) return res.status(404).json({ error});
                if(_cart) {
                    console.log(_cart);                    
                    //console.log(cartItems);
                    return res.status(201).json({ 
                        message: "Cart Item Updated successfully",
                        carts: _cart
                    });
                }
            })
        }else {
            //if cart is not exist then create new cart
            const cart = new Cart({
                user: req.user._id,
                cartItems: [ req.body.cartItems ]
                }); 
                
            cart.save((error, _cart) => {
                if(error) return res.status(400).json({ error});
                if(_cart) {
                    console.log(_cart);                    
                    return res.status(201).json({ 
                        message: "Cart Item added successfully",                        
                        carts: _cart 
                    });
                }
            })
        }
    });      
}

exports.addItemToWishlist = (req, res, next) => {
    Wish.findOne({ user: req.user._id})
    .exec((error, wish) => {
        if(error) return res.status(400).json({ error});
        if(wish) {
            //if cart already exist then update cart by quantity
            const product = req.body.wishItems.product;
            // console.log(product);
            const existProduct = wish.wishItems.find(w => w.product == product);
            let condition, update;
            if(existProduct){
                let updatedQty = existProduct.quantity + req.body.wishItems.quantity;
                condition = { "user": req.user._id, "wishItems.product": product  };
                update = {
                    "$set": {
                        "wishItems.$": {
                            ...req.body.wishItems,
                            quantity: updatedQty,
                            price: req.body.wishItems.price * updatedQty
                        }
                    }
                };                
            } else {
                condition = { user: req.user._id };
                update = {
                    "$push": {
                        "wishItems": req.body.wishItems
                    }
                };
            }            
            Wish.findOneAndUpdate( condition, update )            
            .exec((error, _wish) => {
                if(error) return res.status(400).json({ error});
                if(_wish) {                                 
                    return res.status(201).json({ 
                        message: "Wish Item Updated successfully",
                        wishlists: _wish                                             
                    });
                }
            })
        }else {            
            //if cart is not exist then create new cart
            const wish = new Wish({
                user: req.user._id,
                wishItems: [req.body.wishItems]
                }); 
                
            wish.save((error, _wish) => {
                if(error) return res.status(400).json({ error});
                if(_wish) {
                    return res.status(201).json({ 
                        message: "Wish Item added successfully",
                        wishlist: _wish                                              
                    });
                }
            })
        }
    });             
}

exports.getProductIndex = (req, res, next) => {
    res.send('hello from express');
    console.log(req.session);
    console.log(req.user);    
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
    const prodId = req.params.id;
    Product.findById(prodId)
    .populate('category')
    .populate('attributes')
    .then(product => {
        console.log(product);
        if(product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({message: 'Product not found!'});
        }
    })
}

exports.getProductByCatId = (req, res, next) => {
    const catId = req.params.id;
    console.log(catId);
    const productList = Product.find({category: catId}, function(err, cat) {
        if(err) { return res.status(400).json({ err }) }
        if(cat) {
            return res.status(200).json({cat})
        }
    })
}


exports.getProductCart = (req, res, next) => {
    //console.log(req.user)    
    Cart.find({ user: req.user })
    .populate('cartItems.product')        
    .then(carts => {        
        res.status(200).json({
            //message: "Product Fetch from Cart Successfully",
            carts            
        })
    });        
}
    

exports.postCartDeleteProduct = (req, res, next) => {
    const product = req.params.cartId;
    const user = req.user._id;
    let condition, update;    
        condition = { "user": user, "cartItems.product": product  };
        update = {
            $pull: {
                cartItems: {                    
                    product: product
                }
            }
        };                        
    Cart.findOneAndUpdate( condition, update, { multi: true } )
    .exec((error, _cart) => {
        if(error) return res.status(404).json({ error});
        if(_cart) {
            //console.log(_cart);
            return res.status(201).json({ 
                message: "Cart Item Updated successfully",
                _cart                                
            });
        }
    })      
}

exports.getProductWish = (req, res, next) => {
    Wish.find({user: req.user})    
    .populate('wishItems.product')        
    .then(wishlists => {                        
        res.status(200).json({
            //message: "Product Fetch from Wishlist Successfully",
            wishlists            
        });        
    });        
}

exports.deleteWishProduct = (req, res, next) => {
    console.log(req.params.wishId);
    const product = req.params.wishId;
    const user = req.user._id;
    let condition, update;    
        condition = { "user": user, "wishItems.product": product  };
        update = {
            $pull: {
                wishItems: {                    
                    product: product
                }
            }
        };                        
    Wish.findOneAndUpdate( condition, update, { multi: true } )
    .exec((error, _wish) => {
        if(error) return res.status(404).json({ error});
        if(_wish) {
            //console.log(_wish);
            return res.status(201).json({ 
                message: "Wish Item Updated successfully",
                _wish                                
            });
        }
    })
}

exports.getMyOrders = (req, res, next) => {
    Order.find()                      
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
        user: req.user,
        orderItems: {
          cart: req.body.cart,
          //product: req.body.product,
          quantity: req.body.quantity            
        }
    });
    console.log(order);    
    order.save((error, order) => {
        if(error) return res.status(400).json({ message: "something wrong", error });
        if(order) {
            console.log(order);
            return res.status(201).json({ 
                message: 'Your order has been successfully placed',
                oId: order._id,
                user: order.user._id,
                cId: order.orderItems.cart,
                //pId: order.orderItems.product,
                oQty: order.orderItems.quantity
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