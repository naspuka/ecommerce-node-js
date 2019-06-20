const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 4000;

const enviroment = process.env.NODE_ENV;

// set the logic to allow mongodb connectioon before the app start running
  async function mongodb() {
    mongoose.connect(process.env.MONGO_URL,
         { useNewUrlParser: true });
    await mongoose.connection.on('connected',
     ()=> console.info('mongodb connected'));   

     app.listen(port,
         ()=>console.info(`App is listening on port ${port}`));
  }
     mongodb();

// using morgan for dev logging
if(enviroment === 'development'){
    app.use(morgan('dev'));
}

//using npm CORS which i dont really like
app.use(cors());

// Setting CORS for server conflicts.
// app.use( (req,res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers",
//      "Origin, X-Requested-With, Content-Type, Accept. Authorization");
//      next();

//     if(req.method === "OPTIONS"){
//         res.header("Acess-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
//         return res.status(200).json({});
//     }
// });

// exposing app to use uploads folder
app.use(express.static('uploads'));
// setting app to use body-parser for taking request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//app is using the available routes
app.use(require('./api/routes/product'));
app.use(require('./api/routes/orders'));
app.use(require('./api/routes/user'));

// handling error due to route conflicts
app.use( (req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
    });

    app.use( (error, req, res, next)=>{
        res.status(error.status || 500);
        res.json({
            error:{
                status: error.status,
                message: error.message
            }
        });
    });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
