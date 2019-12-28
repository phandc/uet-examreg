const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const readExcel = require('convert-excel-to-json');
const multer = require('multer');

const User = require('../model/user');


let message = "";

const router = express.Router();
router.use(cors());

router.post('/register', (request, response) => {

  let userData = {
    userID: request.body.userID,
    username: request.body.username,
    password: request.body.password,
    email: request.body.email,
    role: request.body.role
  }
  User.findOne({
    where: {
      username: request.body.username
    }
  }).then(user => {
    if(!user) {
      bcrypt.hash(request.body.password, 10, (err, hash) => {
        userData.password = hash;
        User.create(userData).then(user => {
          response.json({status: 'Registered'});
        })
            .catch(err =>{
              response.send('error:' + err);
            })
      })
    }
    else{
      response.json({error: 'User existed'});
    }
  })
})

router.get('/login', (request, response) => {
  response.render('login');
})


router.post('/login', (request, response) => {
  User.findOne({
    where: {
      username: request.body.username
    }
  }).then(user => {
    if(user) {
      if(bcrypt.compareSync(request.body.password, user.password)){
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn : 1440
        })


        console.log(user.dataValues.username);

        if(user.dataValues.role === 'student'){
          message = "Đăng nhập thành công!"
          return response.redirect('student/subjects');
        }
        else {
          message = "Đăng nhập thành công!"
          return response.redirect('admin/home');
        }

        //  response.send({token : token});

      }
      else
      {
        message = "Tài khoản hoặc mật khẩu không đúng"
        return response.redirect('login');
      }
    }}).catch(err => {
    console.log(err);
    response.status(400).json({error: err});
  })
});
router.get('/student/subjects', (request, response) =>{
  response.render("student/subjects");
});
router.get('/student/registry', (request, response) =>{
  response.render("student/registry");
});
router.get('/student/reset-password', (request, response) =>{
  response.render("student/reset-password");
});
router.get('/student/home', (request, response) =>{
  response.render("student/home");
});
router.get('/student/select-shift', (request, response) =>{
  response.render("student/select-shift");
});
router.get('/admin/home', (request, response) =>{

  response.render("admin/home");
});
module.exports = router;
