var express = require('express');
var router = express.Router();


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});


// Render the dashboard page.
router.get('/dashboard', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  var db = req.db;
  var usercollection = db.collection('usercollection');
  
  //Update test
  usercollection.update({email:  req.user.email} , {$set:{year:2000}}, function(err, result) {
    if (!err) console.log('Year updated!');
    
     var db = req.db;
  
    //Call get user by email service
    var UserController = require('../controllers/userController');
    var userController = new UserController(db);
    
    userController.findUserByEmail(req.user.email, function(err, result) {
      if (err) throw err;
      
      //Store komoner in session
      req.session.komoner = result;
      console.log(result);
      
      //Render the dashboard page
       res.render('dashboard', {user: req.user, title: 'Dashboard', session: req.session});
      });
  });
 
});

module.exports = router;