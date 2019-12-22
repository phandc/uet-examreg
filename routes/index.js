var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/user/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.get("/registry", function(request, response)  {

  response.render("student/registry");
});
router.get("/reset-password", function(request, response)  {

  response.render("student/reset-password");
});
router.get("/council", function(request, response)  {

  response.render("faculty/council");
});
router.post('/', (req, res, next) => {
  let sql = "select * from user";

})

module.exports = router;
