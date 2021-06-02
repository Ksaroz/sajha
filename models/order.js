const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: {
        cart: {type: Schema.Types.ObjectId, ref: 'Cart', required: true},
        // product: { type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: { type: Number, default: 1}        
    }    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);