const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const readExcel = require('read-excel-file/node');
const multer = require('multer');
const fs = require('fs');

const User = require('../model/user');

const admin_router = express.Router();
admin_router.use(cors());
const storage = multer.diskStorage({
    destination: (request, response, cb) => {
        cb(null, __dirname + '/upload/');
    },
    filename: (request, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname) ;
    }
})
const upload = multer({storage: storage});

admin_router.post('/studentRegister', upload.single("File"), (request, response) => {
    console.log('req.file:' , request.file);
    let filepath = __dirname + '/upload/' + request.file.filename;
    let count = 0;

    //read excel file
    readExcel(filepath).then((rows) => {
        //remove header row
        rows.shift();

        let user_name = rows.map(rows => rows[3]);
        let password = rows.map(rows => rows[4]);

        for(let i = 0; i < user_name.length; i++){
            let userData = {
                userID: user_name[i],
                username: user_name[i],
                password: password[i],
                email: "",
                role: "student"
            }
            //find data query
            User.findOne({
                where: {
                    username: user_name[i],
                }
            }).then(user => {
                if(!user) {
                    //hashing password
                    bcrypt.hash(password[i], 10, (err, hash) => {
                        userData.password = hash;
                        User.create(userData).then(user => {
                            console.log("success");
                            ++count;
                            return;
                        })
                            .catch(err =>{
                                console.log('error:' + err);
                            })
                    })
                } else {
                    console.log({ error: 'User already exists' });
                }
            })
                .catch(err => {
                    response.send('error: ' + err)
                })
        }
    });
    admin_router.get('/home', (request, response) =>{
        console.log("message : " + message);
        response.render("admin/home");
    })
    //delete uploaded file
    fs.unlinkSync(filepath);
    response.send('file upload success, added ' + count + ' account(s)');
});

module.exports = admin_router;
