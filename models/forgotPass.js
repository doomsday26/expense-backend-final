const sequelize= require('../database')
const Sequelize= require('sequelize')

const ForgotRequest=sequelize.define('forgotRequest', {
    id:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
   
    },
    isActive:Sequelize.BOOLEAN
});

module.exports=ForgotRequest;