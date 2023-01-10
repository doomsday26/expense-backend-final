const User= require('../models/users')
const bcrypt = require('bcrypt');
const saltRounds= 10;

exports.saveUser=(req,res,next)=>{
let email= req.body.email;
User.findAll({where:{email:email}}).then(users=>{
    if(users[0]){
   
        res.send({
            "success":false,
        })
    }else{

bcrypt.genSalt(saltRounds,(err,salt)=>{
    bcrypt.hash(req.body.password,salt,(err,hash)=>{
        User.create({
            name:req.body.name,
            email:req.body.email,
            password:hash
        }).then((result=>{
            console.log(result);
            res.json({
                "success":true
            })
        }))
        .catch(err=>{
            console.log(err);
        })
    })
})





     
    }
   
}).catch(err=>{
    console.log(err);
})


   
}
//{ name: 'harsh51', email: 'patient5.com', password: 'wewq' }