const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attributeSchema = new Schema({
    attributeName: {
        type: String,
        required: true
    },
    variationName: {
        type: String,
        required: true
    },    
    // productId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Product'
    // }
});

module.exports = mongoose.model('Attribute', attributeSchema);
