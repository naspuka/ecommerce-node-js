const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = mongoose.Schema({
    productID: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
    }
});


module.exports = mongoose.model('order', orderSchema);