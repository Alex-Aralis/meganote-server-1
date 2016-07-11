var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

//UPDATE user
router.patch('/', (req, res) => {
    console.log(jwt.verify(req.body.token, process.env.JWT_SECRET));

    User.findOne({
        _id: jwt.verify(req.body.token, process.env.JWT_SECRET).id
    })
    .then( user => {
        if(req.body.newUser.name) user.name = req.body.newUser.name;
        if(req.body.newUser.username) user.username = req.body.newUser.username;

        user
            .save()
            .then(() => {
                res.json({
                    user,
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err
                });
            });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({err});
    });
});

// CREATE a user
router.post('/', function(req, res) {
  console.log(req.body.user);

  if (!passwordsPresent(req.body.user) || !passwordsMatch(req.body.user)) {
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

  user
    .save()
    .then(
      userData => {
        var token = jwt.sign(userData._id, process.env.JWT_SECRET, {
          expiresIn: 60*60*24
        });
        res.json({
          user: userData,
          authToken: token
        });
      }
    )
    .catch(
        err => {
            res.status(404).json({err});
            console.log(err);
        }
    );
});

module.exports = router;

function passwordsPresent(payload) {
  return (payload.password && payload.passwordConfirmation)
}

function passwordsMatch(payload) {
  return (payload.password === payload.passwordConfirmation)
}
