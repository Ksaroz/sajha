const Product = require('../models/product');
const Category = require('../models/category');
const Attribute = require('../models/attribute');
const Order = require('../models/order');
//const { populate } = require('../models/product');

// exports.getAddProduct = (req, res, next) => {
//     if (!req.session.isLoggedIn) {
//         return res.redirect('/login');
//     }
//     res.render('admin/addproducts', { 
//         title: 'Add Product'        
//     });
// }

exports.postAddProduct = (req, res, next) => {
    const productName = (req.body.name);
    const productImageUrl = (req.body.image); 
    const productDescription = (req.body.description);
    const productPrice = (req.body.price);
    const productCategory = (req.body.category)

    const product = new Product({
        name: productName,
        imageUrl: productImageUrl,        
        description: productDescription,
        price: productPrice,
        categoryId: productCategory
    });
    console.log(product);
    product.save().then(createdProduct => {
        res.status(201).json({
            message: 'Product Added Successfully',
            prodId: createdProduct._id
            });        
    });    
}

exports.postAddCategory = (req, res, next) => {
    const categoryName = (req.body.categoryName);
    const subCategoryName = (req.body.subCategoryName);

    const category = new Category({
        categoryName: categoryName,
        subCategoryName: subCategoryName
    });
    category.save().then(savedCategory => {
        res.status(201).json({
            message: 'Category Added Successfully',
            catId: savedCategory._id
        });
    });
}

exports.postAddAttribute = (req, res, next) => {
    const attributeName = (req.body.attributeName);
    const variationName = (req.body.variationName);

    const attribute = new Attribute ({
        attributeName: attributeName,
        variationName: variationName
    });
    attribute.save().then(savedAttribute => {
        res.status(201).json({
            message: 'Category Added Successfully',
            attId: savedAttribute._id
        });
    });
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .populate('categoryId')
    .then(products => {    
        console.log(products);    
        res.status(200).json({
            message: 'Product fetch Successfully',
            products: products
        });
    });    
}

exports.getAllCategories = (req, res, next) => {
    Category.find()
    .then(categories => {        
        res.status(200).json({
            message: 'Categories fetch Successfully',
            categories: categories
        });
    });    
}

exports.getAllAttributes = (req, res, next) => {
    Attribute.find()
    .then(attributes => {        
        res.status(200).json({
            message: 'Attributes fetch Successfully',
            attributes: attributes
        });
    });    
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.deleteOne({ _id: productId })
    .then(() => {        
        res.status(200).json({message: 'Product Deleted!'});        
    });    
}

exports.deleteCategory = (req, res, next) => {
    const categoryId = req.params.id;
    Category.deleteOne({ _id: categoryId })
    .then(() => {
        console.log('Category Deleted');
        res.status(200).json({message: 'Category Deleted!'});        
    });    
}

exports.deleteAttribute = (req, res, next) => {
    const attributeId = req.params.id;
    Attribute.deleteOne({ _id: attributeId })
    .then(() => {
        console.log('Attribute Deleted');
        res.status(200).json({message: 'Attribute Deleted!'});        
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

/* backend get edit categories function */
exports.getEditCategories = (req, res, next) => {
    Category.findById(req.params.id).then(category => {
        if(category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({message: 'Category not found!'});
        }
    })
}
/* end of function */

/* backend get edit categories function */
exports.getEditAttributes = (req, res, next) => {
    Attribute.findById(req.params.id).then(attribute => {
        if(attribute) {
            res.status(200).json(attribute);
        } else {
            res.status(404).json({message: 'Attribute not found!'});
        }
    })
}
/* end of function */

/* backend post edit products function */
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
/* End of function */

/* backend post edit categories function */
exports.putEditCategories = (req, res, next) => {
    const category = new Category({
        _id: req.params.id,
        categoryName: req.body.categoryName,
        subCategoryName: req.body.subCategoryName,                
    });
    Category.updateOne({_id: req.params.id}, category)
    .then(result => {        
        res.status(200).json({message: 'Update Successful!'});
    });    
} 
/* End of function */

exports.putEditAttributes = (req, res, next) => {
    const attribute = new Attribute({
        _id: req.params.id,
        attributeName: req.body.attributeName,
        variationName: req.body.variationName,                
    });
    Attribute.updateOne({_id: req.params.id}, attribute)
    .then(result => {        
        res.status(200).json({message: 'Update Successful!'});
    });    
} 
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