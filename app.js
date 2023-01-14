const express= require('express')
require('dotenv').config()
const fs= require('fs')
const compression = require('compression')
const helmet= require('helmet')
const app= express();
const path= require('path')
const cors= require('cors')
const morgan = require('morgan')
const bodyparser= require('body-parser')
const sequelize= require('./database')
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(bodyparser.json())
app.use(cors())
app.use(compression())
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );
//app.use(helmet({   contentSecurityPolicy: {  useDefaults: true, directives: { 'script-src': ["'self'", "https://whitelisted-domain.com"]  }  }  }))
app.use(morgan('combined',{stream:accessLogStream}))
const Expense= require('./models/expense')
const Order= require('./models/orders')
const User= require('./models/users')
const userControllers= require('./controllers/signup')
const loginRoutes=require('./routes/login')
const expenseRoutes= require('./routes/expenseRoute')
const purchaseRoutes=require('./routes/purchase');
const forgotPassReq = require('./models/forgotPass');


// app.use(
//     helmet.contentSecurityPolicy({
//       useDefaults: true,
//       directives: {
//         "img-src": ["'self'", "https: data:"]
//       }
//     })
//   )
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use(loginRoutes)
app.post('/user/signup',userControllers.saveUser)

app.use((req,res)=>{
    console.log('url called>>>> ', req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})


Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'}),
User.hasMany(Expense)
//{constraints:true,onDelete:'CASCADE'}

Order.belongsTo(User)
User.hasMany(Order)

forgotPassReq.belongsTo(User)
User.hasMany(forgotPassReq)


// cicd deployments 

sequelize
.sync()
//.sync({force:true})
.then(result=>{

    // console.log(result);
})
.catch(err=>{console.log(err);})

app.listen(process.env.PORT,()=>{
    console.log("server is running onport 3000");
})

//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  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

///this is the latest file
