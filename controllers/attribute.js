const Attribute = require('../models/attribute');

///////////////*Getting attributes*/////////////////

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

exports.getEditAttributes = (req, res, next) => {
    Attribute.findById(req.params.id).then(attribute => {
        if(attribute) {
            res.status(200).json(attribute);
        } else {
            res.status(404).json({message: 'Attribute not found!'});
        }
    })
}

//////////////////////////*end of getting attributes*/////////////////////////


/////////////////////////*post attributes*////////////////////////////////

exports.postAddAttribute = (req, res, next) => {
    const attribObj = {
        name: req.body.name,
        slug: req.body.slug,
        parentId: req.body.parentId,
        creator: req.user
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

//////////////////*end of posting attributes*//////////////////////////////////

////////////////////*Put attributes*/////////////////////////////

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
/////////////////////////*end of put attributes*///////////////////

///////////////////////*Delete attributes*////////////////////

exports.deleteAttribute = (req, res, next) => {
    const attributeId = req.params.id;
    Attribute.deleteOne({ _id: attributeId, creator: req.user })
    .then((result) => {
        console.log(result);
        if(result.n > 0) {                        
            res.status(200).json({message: 'Attribute Deleted!'});        
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }  
    });    
}

/////////////////*end of deleting attributes*//////////////////////