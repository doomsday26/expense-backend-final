const express= require('express')
const loginController= require('../controllers/login')
const router= express.Router()
const expensecontroller= require('../controllers/expenses')
const authenticatecontroller= require('../controllers/authenticate')



router.post('/user/login',loginController.login)
router.get('/premium',loginController.premiumLeaderBoard)

router.post('/password/forgotpassword',loginController.forgetpass)
router.post('/password/newpassword',loginController.newPassword)

module.exports=router