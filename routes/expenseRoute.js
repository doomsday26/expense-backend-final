const express= require('express')
const router= express.Router()
const expensecontroller= require('../controllers/expenses')
const authenticatecontroller= require('../controllers/authenticate')


router.get('/:limit/:pageno',authenticatecontroller.userAuthenticate,expensecontroller.getExpenses);
router.get('/report',authenticatecontroller.userAuthenticate,expensecontroller.report);
router.get('/downloadreport',authenticatecontroller.userAuthenticate,expensecontroller.downloadReport);
router.get('/downloadAllreport',authenticatecontroller.userAuthenticate,expensecontroller.downloadAllReports);
router.get('/downloadOldreport/:userId/:date',authenticatecontroller.userAuthenticate,expensecontroller.downloadOldReport);
router.post('/',authenticatecontroller.userAuthenticate,expensecontroller.addExpense)
router.get('/:expenseId',authenticatecontroller.userAuthenticate,expensecontroller.getOneExpense)
router.delete('/:expenseId',authenticatecontroller.userAuthenticate,expensecontroller.deleteExpense)
router.put('/:expenseId',authenticatecontroller.userAuthenticate,expensecontroller.updateExpense)

//router.get('/expenseReport',authenticatecontroller.userAuthenticate,expensecontroller.)

module.exports= router