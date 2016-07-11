var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

//SIGN IN
router.post('/', (req, res) => {
    console.log(req.body.user);

    User.findOne({
        username: req.body.user.username,
    })
    .then(user => {
        console.log('user found');
        console.log(user);
        user.authenticate(req.body.user)
            .then(({user, authToken}) => {
                res.json({
                    user,
                    authToken,
                });
            })
            .catch(err => {
                res.status(404).json({err});
            });
    })
    .catch(err => {
        console.log('erring');
        res.status(404).json({err});
    });
});

module.exports = router;
