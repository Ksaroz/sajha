const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    subCategoryName: {
        type: String,
        required: true
    },    
    // productId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Product'
    // }
});

module.exports = mongoose.model('Category', categorySchema);
