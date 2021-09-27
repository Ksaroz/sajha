const Wish = require('../models/wish');


////////////////*Getting all wishes*//////////////

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

//////////////////*Post new product into wishlist*///////////////////////

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
                            //price: req.body.wishItems.price * updatedQty
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
                        wishlists: _wish                                              
                    });
                }
            })
        }
    });             
}

exports.deleteWishProduct = (req, res, next) => {
    //console.log(req.params.pId);
    const product = req.params.pId;
    const user = req.user;
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