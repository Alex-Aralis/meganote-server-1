var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

//UPDATE user
router.patch('/', (req, res) => {
    console.log(jwt.verify(req.body.token, process.env.JWT_SECRET));

    if(req.body.newUser.name) req.user.name = req.body.newUser.name;
    if(req.body.newUser.username) req.user.username = req.body.newUser.username;

    req.user
        .save()
        .then(() => {
            res.json({
                user: req.user,
            });
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

// CREATE a user
router.post('/', function(req, res) {
  console.log(req.body.user);

  if (!passwordsPresent(req.body.user) || !passwordsMatch(req.body.user)) {
    console.log(4);
    res.status(422).json({
      message: 'Passwords must match!'
    });
    return;
  }

  var user = new User({
    name: req.body.user.name,
    username: req.body.user.username,
    passwordDigest: bcrypt.hashSync(req.body.user.password, 10)
  });


  console.log(user);

  user
    .save(
      err => {
        if(err){
            console.log(`error in creating user ${err}`);
            res.status(404).json({err});
            return;
        }

        var token = jwt.sign(user._id, process.env.JWT_SECRET, {
          expiresIn: 60*60*24
        });
        res.json({
          user: user,
          authToken: token
        });
      });
});

module.exports = router;

function passwordsPresent(payload) {
  return (payload.password && payload.passwordConfirmation)
}

function passwordsMatch(payload) {
  return (payload.password === payload.passwordConfirmation)
}
