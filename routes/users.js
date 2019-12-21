const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const readExcel = require('convert-excel-to-json');
const multer = require('multer');

const User = require('../model/user');

const user_router = express.Router();
user_router.use(cors());

user_router.post('/register', (request, response) => {

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



user_router.post('/login', (request, response) => {
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
                response.send({token : token});
            }
        }
        else
        {
            response.status(400).json({error: 'User does not exist'})
        }
    }).catch(err => {
        console.log(err);
        response.status(400).json({error: err});
    })
});

user_router.get('/logout', (request, response) =>{

})




/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

module.exports = user_router;
