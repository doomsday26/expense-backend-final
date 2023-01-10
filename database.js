require('dotenv').config()

const Sequelize= require('sequelize')
const sequelize= new Sequelize(process.env.SCHEMA,process.env.SQL_USER,process.env.SQLPASSWORD,{
    host:process.env.HOST,
    dialect:'mysql'
})
module.exports= sequelize;