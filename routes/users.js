var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var UserController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* GET user by id */
router.get('/id/:id', function(req, res) {
    
    var userController = new UserController(req.db);
    var userId = req.params.id;

    userController.findUserById(new ObjectID(userId), function(err, result) {
        if (err) throw err;
        res.json(result);
    });

});

/* GET user by email */
router.get('/:email', function(req, res) {
    
    var userController = new UserController(req.db);
    var email = req.params.email;
    
    userController.findUserByEmail(email, function(err, result) {
        if (err) throw err;
        res.json(result);
    });

});

module.exports = router;
