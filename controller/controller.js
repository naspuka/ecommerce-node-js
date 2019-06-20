const Product = require('../model/product');
const moment = require('moment');
const Order = require('../model/order');
const Response = require('../response/response');


module.exports = {
    getBaseUrl: (req, res, next)=>{
        res.status(200).json({
            error: false,
            message: 'Welcome to ecommerce api'
        });
    },

    getAllProducts: (req, res, next)=>{
        Product.find({})
        .select('name price _id product_image created_at')
        .exec()
        .then(products =>{
            const response = {
                error: false,
                count: products.length,
                products: products.map(product =>{
                    return{
                        _id: products._id,
                        name: products.name,
                        price: products.price,
                        image_path: products.product_image,
                        created_at: products.created_at
                    }
                })
            }
            res.status(202).json(response)
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 400)
        })
    },

    createProduct: (req, res,  next)=>{
        const product = new Product({
            name:req.body.name,
            price: req.body.price,
            product_image: req.file.path
        });
        //console.log(req.file);
        product.save()
        .then(product=>{
            const response = {
                error: false,
                message:"product successfully added to cart",
                createdProduct: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image_path: product.product_image,
                    created_at: product.created_at
                }
            };
            res.status(201).json(response)
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500)
        });
    },

    getProduct: (req, res, next)=>{
        Product.findById(req.params.id)
        .select('id name price product_image created_at')
        .exec()
        .then(product=>{
            res.status(201).json({
                error: false,
                product: product
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500)
        });
    },

    patchProduct: (req,res,next)=>{
        let newBody = {
            name: req.body.name,
            price: req.body.price,
            created_at: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
        }
        Product.findByIdAndUpdate(req.parama.id, newBody, {new: true})
        .select({'__v':0})
        .then( newPoduct =>{
            res.status(202).json({
                error:false,
                message: "product successfully updated",
                updated_product:newPoduct 
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 400)
        });
    },

    deleteProduct: (req, res, next)=>{
        Product.deleteOne({_id:req.params.id})
        .then(delproed=>{
            res.status(200).json({
                error: false,
                messsage: "product successfully deleted"
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 400)
        });
    },

    //controller for ORDERS
    getOrderBase: (req, res, next)=>{
        Order.find({})
        .populate('productID')
        .select({'__v':0})
        .exec()
        .then(orders=>{
            res.status(202).json({
                error: false,
                message: "sucessfully fetched order list",
                orders_count: orders.length,
                orders: orders
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 404)
        })
    },
    createOrder: (req, res, next)=>{
        Product.findById(req.body.productID)
        .select({"__v":0, "created_at":0, "_id":0})
        .then(prod=>{
            if(!prod){
                return res.status(404).json({
                    error: true,
                    message: "product not found"
                });
            }
            else{
                const order = new Order({
                    productID: req.body.productID,
                    quantity: req.body.quantity
                });
                return order.save()
                .then(order=>{
                    res.status(201).json({
                        error: false,
                        message: "order successful",
                        order: {
                            orderID: order._id,
                            time_ordered: order.ordered_at,
                            quantity: order.quantity,
                            productID: order.productID,
                            ordered_product: product
                    }
                    })
                })
                .catch(err=>{
                    Response(res)
                    .error_res(err, 500)
                });
            }
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500)
        });
    },

    getOrder: (req, res, next)=>{
        Order.findById(req.params.id).select({"__v":0})
        .populate('productID creates_at _id name').exec()
        .then(order=>{
            res.status(201).json({
                error: false,
                order: order
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 404)
        });
    },

    deleteOrder: (req, res, next)=>{
        Order.deleteOne({_id:req.params.id})
        .then(orderdel=>{
            res.status(201).json({
                error:false,
                message: `order with ${req.params.id} deleted`
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 404)
        });
    }
    
}