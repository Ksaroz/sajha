const Category = require('../models/category');


///////////////*Get all categories*////////////////

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

////////////////////* get categories for edit *//////////////////
exports.getCategory = (req, res, next) => {
    Category.findById(req.params.id).then(category => {
        if(category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({message: 'Category not found!'});
        }
    })
}
////////////////////////* end of function */////////////////////////////

/////////////*end of getting categories*/////////////////

///////////////*Post new category*/////////////////

exports.postAddCategory = (req, res, next) => {    
    const categoryObj = {
        name: req.body.name,
        slug: req.body.slug,
        parentId: req.body.parentId,
        creator: req.user
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

////////////////*end of post new category*/////////////////////

//////////////////*Delete category*/////////////////////

exports.deleteCategory = (req, res, next) => {
    const categoryId = req.params.id;
    Category.deleteOne({ _id: categoryId, creator: req.user })
    .then((result) => {
        console.log(result);
        if(result.n > 0) {            
            res.status(200).json({message: 'Category Deleted!'});        
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }        
    });    
}

///////////////////*end of deleting categories*/////////////////////
