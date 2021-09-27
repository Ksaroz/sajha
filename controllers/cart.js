const Cart = require('../models/cart');

/////////////*Getting all cart products*/////////////////////

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

////////////////////*Post new product into cart*///////////////////////

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
                            quantity: updatedQty
                            //price: req.body.cartItems.price * updatedQty
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

exports.postCartDeleteProduct = (req, res, next) => {
    const product = req.params.pId;    
    const user = req.user;    
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
            console.log(_cart);
            return res.status(201).json({ 
                message: "Cart Item Updated successfully",
                _cart                                
            });
        }
    })      
}