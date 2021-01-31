const bcrypt = require('bcryptjs');
//const Slugify = require('slugify');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Attribute = require('../models/attribute');
const Order = require('../models/order');
//const { populate } = require('../models/product');

function createCategory(categories, parentId = null) {
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    }else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategory(categories, cate._id)
        });
    }

    return categoryList;
};

exports.postAddUser = (req, res, next) => {
    const userFirstName = (req.body.firstname);
    const userLastName = (req.body.lastname); 
    const userEmail = (req.body.email);
    const userPassword = (req.body.password);
    const userRole = (req.body.role);

    bcrypt.hash(userPassword, 12)
    .then(hashed => {
        const user = new User({
            firstname: userFirstName,
            lastname: userLastName,        
            email: userEmail,
            password: hashed,
            role: userRole         
        });    
        console.log(user);
    user.save().then(createdUser => {
        res.status(201).json({
            message: 'New User Added Successfully',
            userId: createdUser._id
            });        
    }).catch(err => console.log(err));    
    }).catch(err => console.log(err));
}

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
    // const catName = (req.body.name);
 /** working code for add category */   
    // const category = new Category({
    //     name: req.body.name
    // });
    // console.log(category);
    // category.save().then(createdCategory => {
    //     console.log(createdCategory);
    //     res.status(201).json({
    //         message: 'Category Added Successfully',
    //         catId: createdCategory._id
    //     });
    // });
/*** end of working code for add category */

    const categoryObj = {
        name: req.body.name,
        slug: req.body.slug,
        parentId: req.body.parentId
    }

    if(req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    cat.save((error, category) => {
        if(error) {
           return res.status(400).json({ error, message: "Sorry! you cannot repeat the same category name!" }); 
        }

        if(category) {
            return res.status(201).json({ 
                categories: category,
                catId: category._id,                                
                message: "Category Added Successfully!"
        });
        }
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
    }).catch(err => console.log(err));
}

exports.getAllUsers = (req, res, next) => {
    User.find()
    .then(users => {
        res.status(200).json({
            message: 'Users fetch Successfully',
            users: users
        });        
    });
}

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .populate('categoryId')
    .then(products => {    
        //console.log(products);    
        res.status(200).json({
            message: 'Product fetch Successfully',
            products: products
        });
    });    
}

exports.getAllCategories = (req, res, next) => {
    Category.find({})
    .exec((error, categories) => {
        if(error) return res.status(400).json({ error });
        if(categories) {

            const categoryList = createCategory(categories);

            res.status(200).json({
                message: 'Categories fetch Successfully',
                categories: categoryList
            });
        }
    });
    // .then(categories => {        
    // });    
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

exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    User.deleteOne({ _id: userId })
    .then(() => {        
        res.status(200).json({message: 'User Deleted!'});        
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
        name: req.body.name,
        // subCategoryName: req.body.subCategoryName,                
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