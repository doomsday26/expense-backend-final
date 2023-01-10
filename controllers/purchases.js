const Expense= require('../models/expense')
const Order= require('../models/orders')
const User= require('../models/users')
const Razorpay = require('razorpay')
const { json } = require('body-parser')
require('dotenv').config()

exports.purchasePremium=(req,res,next)=>{
console.log("request body >>>>>>>", req.user);

try {
    let rzp = new Razorpay({
        key_id:process.env.RAZORKEY_ID,
        key_secret:process.env.RAZORKEY_SECRET
    })

    var options = {
        amount: 50000, 
        currency: "INR"
      };

rzp.orders.create(options,(err,order)=>{
    if(err){
        throw new Error(JSON.stringify(err))
    }
    console.log(order);
    req.user.createOrder({
        orderId:order.id, paymentId:0, Status:"pending"
    }).then(result=>{
        console.log(result);
        res.status(201).json({order,key_id:rzp.key_id})
    }).catch(err=>{
        console.log(err);
    })    




})



} catch (err) {
    if(err){
        console.log(err);
    }
}




}

exports.updateTransaction=(req,res,next)=>{
    console.log(req.body);
    console.log(req.user);
req.user.getOrders({where:{orderId:req.body.orderId}}).then(
    orders=>{
         console.log(orders);
        orders[0].Status="success"
        orders[0].paymentId=req.body.payment_Id
        orders[0].save();
        res.send({success:true})
    }


    ).catch(err=>{console.log(err);})
}

//{ orderId: 'order_L1YO4VNWcVNcTI', payment_Id: 'pay_L1YOHFxjqULgAD' }
// orderid: '0',
// pymentid: '1'