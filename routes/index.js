var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/class", function(request, response)  {

  response.render("admin/class");
});
router.get("/council", function(request, response)  {

  response.render("admin/council");
});
router.get("/createExam", function(request, response)  {

  response.render("admin/createExam");
});
router.get("/department", function(request, response)  {

  response.render("admin/department");
});
router.get("/admin/student", function(request, response)  {

  response.render("admin/student");
});
router.get("/admin/home", function(request, response)  {

  response.render("admin/home");
});

router.get("/admin/thesis", function(request, response)  {

  response.render("admin/thesis");
});


router.get("/login", function(request, response)  {

  response.render("login");
});
router.get("student/home", function(request, response)  {

  response.render("student/home");
});
router.get("/registry", function(request, response)  {

  response.render("student/registry");
});
router.get("/reset-password", function(request, response)  {

  response.render("student/reset-password");
});
router.get("/admin/student", function(request, response)  {

  response.render("admin/student");
});
router.get("/council", function(request, response)  {

  response.render("admin/council");
});
router.post('/', (req, res, next) => {
  let sql = "select * from user";
})

module.exports = router;
