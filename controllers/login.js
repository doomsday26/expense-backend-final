const User = require("../models/users");
const ForgotRequest = require("../models/forgotPass");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
let uuid;
const Expense = require("../models/expense");
const sequelize = require("../database");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const { use } = require("../routes/login");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateToken(id, name) {
  return jwt.sign({ userId: id, userName: name }, process.env.JWT_KEY);
}

exports.login = (req, res, next) => {
  console.log(req.body);
  User.findAll({ where: { email: req.body.email } })
    .then((users) => {
      console.log(users);
      if (users[0]) {
        let requserpass = req.body.password;
        bcrypt.compare(requserpass, users[0].password, (err, bool) => {
          console.log("truth or false", bool);

          if (bool) {
            res.json({
              userdata: generateToken(users[0].id, users[0].name),
              success: true,
              valid: "congratulations you are logged in successfully",
            });
          } else {
            res.status(401).json({
              success: false,
              valid: "incorrect password",
              status: 401,
            });
          }
        });
      } else {
        res.status(404).json({
          success: false,
          valid: "user doesn't exists",
          status: 404,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.premiumReports=(req,res,next)=>{
  console.log(req.body);
  console.log(req.header);
}

exports.premiumLeaderBoard = (req, res, next) => {
  Expense.findAll({
    attributes: [
      "userId",
      [sequelize.fn("sum", sequelize.col("ammount")), "total_ammount"],
    ],
    group: ["userId"],
    include: { model: User, attributes: ["name"] },
    order: [["total_ammount", "DESC"]],
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.forgetpass = async (req, res, next) => {
  console.log("here in reset ......");
  console.log(req.body);

  User.findAll({ where: { email: req.body.email } })
    .then((users) => {
if(users.length==0){
  res.send({msg:"no user by this name"})
}

      console.log(users);
      return users[0].createForgotRequest({ id: uuidv4(), isActive: true });
    })
    .then(async (result) => {
      uuid = result.id;
      console.log(result);
      const msg = {
        to: "harsh123namdeo123testing@gmail.com", // Change to your recipient
        from: "harshnamdeo261999@gmail.com", // Change to your verified sender
        subject: "we want to reset our password",
        text: "and easy to do anywhere, even with Node.js we aregoing to reset password by this linkkkkkk",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      };

      await sgMail
        .send(msg)
        .then((result) => {
          console.log(result);
        })
        .then((result) => {
          res.send({ requestGenerated: true, id: uuid });
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.newPassword = (req, res, next) => {
  let userEmail = req.body.email;
  let newpass = req.body.newPassword;

  User.findOne({ where: { email: userEmail } }).then((user) => {
    user
      .getForgotRequests({ where: { id: req.body.uuid } })
      .then(async (changerequest) => {
        if (changerequest[0].isActive) {
          changerequest[0].isActive = false;
          await changerequest[0].save();

          let changedpassword;
          //change new password
          async function hashPassword(plaintextPassword) {
            changedpassword = await bcrypt.hash(plaintextPassword, saltRounds);
            // Store hash in the database
          }
       await  hashPassword(newpass);
          user.password = changedpassword;
          return user.save();
        } else {
          res.send({ success: false });
        }
      })
      .then((result) => {
        //console.log(result);
        res.send({ success: true });
      });
  });
};
