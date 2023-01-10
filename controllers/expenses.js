const Expense = require("../models/expense");
const User = require("../models/users");
const Order = require("../models/orders");
const jwt = require("jsonwebtoken");
const sequelize = require("../database");
const Sequelize = require("sequelize");
const AWS = require("aws-sdk");
const UserServices = require("../services/userservices");
const S3service = require("../services/s3services");
require("dotenv").config();

//awsexpensereportbucket
//controllers
let status;
exports.getExpenses = async (req, res, next) => {
  //console.log("request user >>>>>>>>>>>>>>>>",req.user);
  console.log(
    "params>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    req.params.limit,
    req.params.pageno
  );
  let lim=req.params.limit-0;
  let offSet=(req.params.pageno-1)*lim
  try {
    let count = await Expense.count({ where: { userId: req.user.id } });
    console.log("number of expenses>>>>", count);
    let orders = await req.user.getOrders();
    if (orders[orders.length - 1]) {
      status = orders[orders.length - 1].Status;
    } else {
      status = "pending";
    }
    let expenses = await Expense.findAll({offset:offSet,limit:lim ,where: { userId: req.user.id }});
    res.json({ Expenses: expenses, Status: status });
  } catch (err) {
    if (err) {
      console.log(err);
      res.send(err);
    }
  }
};

exports.addExpense = (req, res, next) => {
  console.log(req.body);
  User.findByPk(req.user.id)
    .then((user) => {
      console.log(user);
      return user.createExpense(req.body);
    })
    .then((result) => {
      console.log(result);
      res.send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });

  // Expense.create({"ammount":req.body.ammount, "category":req.body.category,"description": req.body.description}).then(result=>{
  //     res.send(result)
  // }).catch(err=>{
  //     console.log(err);
  // })
};

exports.getOneExpense = (req, res, next) => {
  let id = req.params.expenseId;
  // console.log(req.headers);
  // console.log(req.params.expenseId)
  Expense.findByPk(id)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

exports.deleteExpense = (req, res, next) => {
  let id = req.params.expenseId;
  Expense.findByPk(id)
    .then((expense) => {
      return expense.destroy();
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

exports.report = (req, res, next) => {
  console.log("entering report to display >>>>>>>>>>>");
  console.log(req.user);
  let categoryExpense;
  let descriptionExpense;
  req.user
    .getExpenses({
      attributes: [
        "category",
        [sequelize.fn("sum", sequelize.col("ammount")), "total_ammount"],
      ],
      group: ["category"],
    })
    .then((result) => {
      categoryExpense = result;
      return req.user.getExpenses({
        attributes: [
          "description",
          [sequelize.fn("sum", sequelize.col("ammount")), "total_ammount"],
        ],
        group: ["description"],
      });
    })
    .then((result) => {
      descriptionExpense = result;
      res.send({
        descriptionReport: descriptionExpense,
        categoryReport: categoryExpense,
      });
    });
};

exports.updateExpense = (req, res, next) => {
  let id = req.params.expenseId;
  Expense.findByPk(id)
    .then((expense) => {
      (expense.ammount = req.body.ammount),
        (expense.description = req.body.description);
      expense.category = req.body.category;
      return expense.save();
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.err();
    });
};

exports.downloadReport = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `${req.user.id}/${new Date()}.txt`;
    const fileUrl = await S3service.uploadToS3(stringifiedExpenses, filename);
    console.log(fileUrl);
    res.status(200).json({ url: `${fileUrl}`, succuess: "true" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ fileUrl: "", success: false, err: error });
  }

  //.json({succuess:true})
};

exports.downloadAllReports = async (req, res, next) => {
  console.log("getting from buckets >>>>>>>>>>");
  const bucketName = process.env.BUCKET_NAME;
  const userKey = process.env.IAM_USER_KEY;
  const userSecretKey = process.env.IAM_USER_SECRETKEY;
  let s3bucket = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: userSecretKey,
    Bucket: bucketName,
  });

  const params = {
    Bucket: bucketName,
    Delimiter: "/",
    Prefix: `${req.user.id}/`,
  };

  s3bucket.listObjects(params, function (err, data) {
    if (err) {
      return "There was an error viewing your album: " + err.message;
    } else {
      let arr = [];
      console.log(data.Contents, "<<<all content");
      data.Contents.forEach(function (obj, index) {
        arr.push(obj.Key);
      });
      res.status(200).json({ data: arr });
    }
  });
};

exports.downloadOldReport = async (req, res, next) => {
  console.log("getting old from bucket >>>>>>>>>>");
  console.log("location:>>>>>>" + `${req.params.userId}/${req.params.date}`);
  const bucketName = process.env.BUCKET_NAME;
  const userKey = process.env.IAM_USER_KEY;
  const userSecretKey = process.env.IAM_USER_SECRETKEY;
  let s3bucket = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: userSecretKey,
    Bucket: bucketName,
  });
  const params = {
    Bucket: bucketName,
    Key: `${req.params.userId}/${req.params.date}`,
    Expires: 60 * 3,
  };
  try {
    let x = await new Promise((resolve, reject) => {
      s3bucket.getSignedUrl("getObject", params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    console.log(x);
    res.send(x);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
};
