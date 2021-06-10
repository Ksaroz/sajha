const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Attribute = require('../models/attribute');
const Order = require('../models/order');
const Wish = require('../models/wish');
//const { populate } = require('../models/user');
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

function createAttribute(attributes, parentId = null) {
    const attributeList = [];
    let attribute;
    if(parentId == null){
        attribute = attributes.filter(att => att.parentId == undefined);
    }else {
        attribute = attributes.filter(att => att.parentId == parentId);
    }

    for(let att of attribute){
        attributeList.push({
            _id: att._id,
            name: att.name,
            slug: att.slug,
            children: createAttribute(attributes, att._id)
        });
    }

    return attributeList;
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
        //console.log(user);
    user.save().then(createdUser => {
        res.status(201).json({
            message: 'New User Added Successfully',
            userId: createdUser._id
            });        
    }).catch(err => console.log(err));    
    }).catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {        

    const creator = req.userData.userId;
    console.log(creator);
    const { name, price, quantity, description, category, offers, attributes, variations, spec } = req.body;
    let productPictures = []; 
    if(req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }
    const url = req.protocol + '://' + req.get('host');    
    const products = new Product({
        name: name,
        price,
        quantity,                
        description,                   
        productPictures,
        category,
        offers,
        attributes,
        variations,
        spec,
        creator        
    });
    console.log(products);
    //console.log(req.userData)
    //return res.status(200).json({});
    products.save(((error, products) => {
        if(error) return res.status(400).json({error});
        if(products) {
            //console.log(products);
            res.status(201).json({
                message: "Product Added Successfully",
                products: products                
            });
        }
    }));   
}

exports.postAddCategory = (req, res, next) => {    
    const categoryObj = {
        name: req.body.name,
        slug: req.body.slug,
        parentId: req.body.parentId,
        creator: req.userData.userId
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
    const attribObj = {
        name: req.body.name,
        slug: req.body.slug,
        parentId: req.body.parentId,
        creator: req.userData.userId
    }

    if(req.body.parentId) {
        attribObj.parentId = req.body.parentId;
    }

    const att = new Attribute(attribObj);
    att.save((error, attribute) => {
        if(error) {
           return res.status(400).json({ error, message: "Sorry! you cannot repeat the same category name!" }); 
        }

        if(attribute) {
            return res.status(201).json({ 
                attributes: attribute,
                attId: attribute._id,                                
                message: "Attribute Added Successfully!"
        });
        }
    });  
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
    .populate('category')
    .populate('attributes')
    .populate('creator')    
    .then(products => { 
        //console.log(products);       
        res.status(200).json({
            message: "Product Fetch Successfully",
            products: products,
            catName: products.category
        });
        //console.log(catName);
    });    
}

exports.getAllCategories = (req, res, next) => {
    //const userId = req.userData.userId;
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
    Attribute.find({})
    .exec((error, attributes) => {
        if(error) return res.status(400).json({ error });
        if(attributes) {

            const attributeList = createAttribute(attributes);

            res.status(200).json({
                message: 'Attributes fetch Successfully',
                attributes: attributeList
            });
        }
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
    Product.deleteOne({ _id: productId, creator: req.userData.userId })
    .then((result) => { 
        console.log(result);
        if(result.n > 0) {
            res.status(200).json({message: 'Product Deleted!'});
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }
    });    
}

exports.deleteCategory = (req, res, next) => {
    const categoryId = req.params.id;
    Category.deleteOne({ _id: categoryId, creator: req.userData.userId })
    .then((result) => {
        console.log(result);
        if(result.n > 0) {            
            res.status(200).json({message: 'Category Deleted!'});        
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }        
    });    
}

exports.deleteAttribute = (req, res, next) => {
    const attributeId = req.params.id;
    Attribute.deleteOne({ _id: attributeId, creator: req.userData.userId })
    .then((result) => {
        console.log(result);
        if(result.n > 0) {                        
            res.status(200).json({message: 'Attribute Deleted!'});        
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }  
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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById({_id: prodId}).then(product => {
        console.log(product);
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
    const creator = req.userData.userId;
    console.log(creator);
    console.log(req.file);
    const { name, price, quantity, description, category, offers, attributes, variations, spec } = req.body;
    console.log(req.files.length);
    let productPictures = []; 
    if(req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }
    //const url = req.protocol + '://' + req.get('host');    
    const products = new Product({
        name,
        price,
        quantity,                
        description,                   
        productPictures,
        category,
        offers,
        attributes,
        variations,
        spec,
        creator       
    });
    console.log(products);
    Product.updateOne({_id: req.params.id}, products)
    .then(result => {
        console.log(result);
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
    Category.updateOne({_id: req.params.id, creator: req.userData.userId}, category)
    .then(result => {
        console.log(result);
        if(result.n > 0) {                        
            res.status(200).json({message: 'Update Successful!'});
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }     
    });    
} 
/* End of function */

exports.putEditAttributes = (req, res, next) => {
    const attribute = new Attribute({
        _id: req.params.id,
        attributeName: req.body.attributeName,
        variationName: req.body.variationName,                
    });
    Attribute.updateOne({_id: req.params.id, creator: req.userData.userId}, attribute)
    .then(result => {  
        console.log(result);
        if(result.n > 0) {                                    
            res.status(200).json({message: 'Update Successful!'});
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }  
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

