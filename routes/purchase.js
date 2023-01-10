const express= require('express')
const router= express.Router()
const purchasecontroller= require('../controllers/purchases')
const authenticatecontroller= require('../controllers/authenticate')



router.get('/purchasepremium',authenticatecontroller.userAuthenticate, purchasecontroller.purchasePremium)

router.post('/updateTransactionStatus',authenticatecontroller.userAuthenticate, purchasecontroller.updateTransaction)


module.exports= router
