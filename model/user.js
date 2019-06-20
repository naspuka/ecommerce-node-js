const mongoose = require('mongoose');
const moment = require('moment');


 const userschema = mongoose.Schema({
     name: {
         type: String,
         required: true
     },
     email:{
          type: String,
          required: true,
          unique: true,
          match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     },
     password: {
         type: String,
         required: true
     },
     createdAt:{
         type: String,
         default: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
     }
 });

 module.exports = mongoose.model('user', userschema);