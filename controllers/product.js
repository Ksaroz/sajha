const Product = require('../models/product');

///////////////////* Getting all products*/////////////////////

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .populate('category')
    .populate('attributes')
    .populate('creator')
    .exec((error, products) => {
        if(error) return res.status(400).json({ error });
        if(products) {
            res.status(200).json({
                //message: 'products fetch Successfully',
                products
            });
        }
    }); 
}

///////////////////* Getting single products*/////////////////////

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById({_id: prodId}).then(product => {
        //console.log(product);
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: 'Product not found!'});
        }
    })
}

/////////////////* Getting product by category *//////////////////

exports.getProductByCatId = (req, res, next) => {
    const catId = req.params.id;
    console.log(catId);
    Product.find({category: catId}, function(err, cat) {
        if(err) { return res.status(400).json({ err }) }
        if(cat) {
            return res.status(200).json({cat})
        }
    })
}

/////////////////*Getting products for edit*///////////////////

exports.getEditProducts = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: 'Product not found!'});
        }
    })
}

////////////////////////* end of getting products *///////////////////

///////////////*Post new product*//////////////////////

exports.postAddProduct = (req, res, next) => {            
    const { name, price, quantity, description, category, offers, attributes, variations, spec, creator } = req.body;
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

/////////////////*end of post new product*////////////////////////


////////////////*Put product for edit*///////////////////////

/* backend product edit function */
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

////////////////////*end of put product for edit*////////////////////////

/////////////////////*Delete product*//////////////////////////

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.deleteOne({ _id: productId, creator: req.user })
    .then((product) => { 
        console.log(product);
        if(product.n > 0) {
            res.status(200).json({message: 'Product Deleted!'});
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }
    });    
}

////////////////*end of delete product*/////////////////////////