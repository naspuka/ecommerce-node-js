const mongoose = require('mongoose');
const moment = require('monent');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    createdAt: {
        type:String,
        default: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
    }
});


module.exports = mongoose.model('product', productSchema);