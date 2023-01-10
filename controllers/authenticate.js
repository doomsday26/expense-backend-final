const jwt = require('jsonwebtoken')
const User= require('../models/users')
require('dotenv').config()
let userdata
let i=0
exports.userAuthenticate=  (req,res,next)=>{
jwt.verify(req.headers.authourization,process.env.JWT_KEY,async (err,value)=>{
        if(!err){
userdata=value
//console.log(i++,"usrdd data >>>>>",userdata);
await User.findByPk(userdata.userId).then(result=>{
    req.user=result
  // console.log(result);
   next();
}).catch(err=>{
    console.log(err);
})
    }else{
           res.status(401).json({
            success:false,
        status:401
        })
        }
    })
    

  //  next()
}
// { userId: 2, userName: 'h2', iat: 1671950274 }