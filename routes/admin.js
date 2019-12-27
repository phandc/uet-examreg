const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const readExcel = require('read-excel-file/node');
const multer = require('multer');
const fs = require('fs');

const Class = require('../model/class');
const Faculty = require('../model/faculty');
const User = require('../model/user');
const ExamSession = require('../model/session');

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



admin_router.post('/student', upload.single("File"), (request, response) => {
    console.log('req.file:' , request.file);
    let filepath = __dirname + '/upload/' + request.file.filename;

    console.log(filepath)
    let count = 0;

    //read excel file
    readExcel(filepath).then((rows) => {
        //remove header row
        rows.shift();

        let user_name = rows.map(rows => rows[3]);
        let password = rows.map(rows => rows[4]);
        console.log(password);

        for(let i = 0; i < user_name.length; i++){
            let userData = {
                userID: user_name[i],
                username: user_name[i],
                password: password[i],
                email: user_name[i] + "@uet.vnu.edu",
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

    //delete uploaded file
    fs.unlinkSync(filepath);
    response.send('file upload success, added ' + count + ' account(s)');
});



admin_router.get('/student', (request, response) =>{
    response.render("admin/student");
});
admin_router.get('/class', function(request, response) {


    Class.findAll()
        .then(function(classList){
            response.render('admin/class',{data: classList})
            console.log("ABC" + classList);
        })
        .catch(error=>console.log(`error occurred`,error));

});
admin_router.get('/specialization', function(request, response) {

   Faculty.findAll()
        .then(function(facultyList){
            response.render('admin/specialization',{data: facultyList})
            console.log("ABC" + facultyList);
        })
        .catch(error=>console.log(`error occurred`,error));

});

admin_router.get('/createexam', (request, response) => {
    // ExamSession.findAll()
    //     .then(function(session){
    //         response.render('admin/create',{data: session})
    //         console.log("ABC" + session);
    //     })
    //     .catch(error=>console.log(`error occurred`,error));

    response.render('admin/create_exam');
});
admin_router.get('/createsubject', (request, response) => {

    response.render('admin/create_subject');
});
admin_router.get('/subject', function(request, response) {
    response.render("admin/subject");
});
admin_router.get('/tmr', function(request, response) {
    response.render("admin/thesis-modification-request");
});


module.exports = admin_router;
