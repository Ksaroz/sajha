const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wishSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wishItems: {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1},
        price: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Wish', wishSchema);
