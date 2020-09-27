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
    const productTitle = (req.body.title);
    const productImageUrl = (req.body.imageUrl); 
    const productPrice = (req.body.price);
    const productDescription = (req.body.description);

    const product = new Product({
        title: productTitle,
        price: productPrice,
        description: productDescription,
        imageUrl: productImageUrl,
        userId: req.user
    });
    product.save()
    .then(result => {
        console.log('New Product Added');
        res.redirect('/products')
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('admin/allproducts', {
            prods: products,
            title: 'All products',
            path: '/admin/products'
        });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
    .then(() => {
        console.log('product Deleted');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getEditProducts = (req, res, next) => {
    // const editMode = req.query.edit;
    // if(!editMode) {
    //     return res.redirect('/');
    // }

    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/editProduct', {
            title: 'Edit product',
            path: '/admin/edit',
            product: product
            // editing: editMode,
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProducts = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(productId)
    .then(product => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDesc;
        return product.save();
    })
    .then(result => {
        console.log('Product Updated!');
        res.redirect('/admin/products ');
    })
    .catch(err => console.log(err));
};

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