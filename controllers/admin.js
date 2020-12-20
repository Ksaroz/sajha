const Product = require('../models/product');
const Order = require('../models/order');
//const { populate } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/addproducts', { 
        title: 'Add Product'        
    });
}

exports.postAddProduct = (req, res, next) => {
    const productName = (req.body.name);
    const productImageUrl = (req.body.image); 
    const productDescription = (req.body.description);
    const productPrice = (req.body.price);

    const product = new Product({
        name: productName,
        imageUrl: productImageUrl,        
        description: productDescription,
        price: productPrice,
    });
    product.save().then(createdProduct => {
        res.status(201).json({
            message: 'Product Added Successfully',
            prodId: createdProduct._id
            });        
    });        
    // const product = req.body;
    //console.log(product);
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .then(products => {        
        res.status(200).json({
            message: 'Product fetch Successfully',
            products: products
        });
    });    
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.deleteOne({ _id: productId })
    .then(() => {
        console.log('product Deleted');
        res.status(200).json({message: 'Product Deleted!'});        
    });    
}

exports.getEditProducts = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: 'Product not found!'});
        }
    })
}

exports.putEditProducts = (req, res, next) => {
    const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        imageUrl: req.body.image,        
        description: req.body.description,
        price: req.body.price 
    });
    Product.updateOne({_id: req.params.id}, product)
    .then(result => {        
        res.status(200).json({message: 'Update Successful!'});
    });    
}

/* backend post edit products function */

// exports.postEditProducts = (req, res, next) => {
//     const productId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDesc = req.body.description;

//     Product.findById(productId)
//     .then(product => {
//         product.title = updatedTitle;
//         product.imageUrl = updatedImageUrl;
//         product.price = updatedPrice;
//         product.description = updatedDesc;
//         return product.save();
//     })
//     .then(result => {
//         console.log('Product Updated!');
//         res.redirect('/admin/products ');
//     })
//     .catch(err => console.log(err));
// };
/* End of function */

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
        res.render('admin/orders', {
            title: 'Orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));
};