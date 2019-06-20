const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Response = require('response');

module.exports = {
    createUser: (req, res, next)=>{
        User.findOne({email: req.body.email}).exec()
        .then(data =>{

            if(data){
                res.status(409).json({
                    status: 409,
                    message: 'email does not exist'
                });
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hashpass)=>{

                    if(err){
                        res.status(500).json({
                            error: err.message
                        });
                    }
                    else{
                        const user = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hashpass
                        });
                        user.save()
                        .then(user =>{
                            res.status(200).json({
                                error: false,
                                message: `user successfully created ${user._id}`
                            });
                        })
                        .catch(err=>{
                            Response(res)
                            .error_res(500)
                        });
                    }
                })
            }
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500);
        });
    },


    logUserIn: (req, res, next)=>{
        User.findOne({email:req.body.email}).exec()
        .then( user=>{
            if(!user){
                return res.status(401).json({
                    error: true,
                    message: 'email doesnt exist kindly signup'
                });
            }
            else{
                bcrypt.compare(req.body.password, user.password, (err, result)=>{
                    if(err){
                        return res.status(401).json({
                            error: true,
                            message: 'Authentication failed'
                        })
                    }
                    if(result){
                        const token= jwt.sign({
                            email: user.email,
                            userID: user._id
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1h'
                        }
                        );
                        return res.status(200).json({
                            error: false,
                            message: 'Logged In successfully',
                            token: token
                        }); 
                    }
                    else{
                        return res.status(401).json({
                            error: true,
                            message: 'Incorrect password'
                        });
                    }
                })
            }
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500);
        });
    },

    deleteUser: (req, res,next)=>{
        User.deleteOne({_id: req.params,id})
        .then(data=>{
            res.status(200).json({
                error: false,
                message: 'user successfully deleted'
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500)
        });
    }
}

