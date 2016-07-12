require('dotenv').load();
var db = require('../config/db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var userSchema = db.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordDigest: {
    type: String,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

userSchema.methods.toJSON = function() {
  var user = this.toObject();
  delete user.passwordDigest;
  delete user.__v;
  return user;
};

userSchema.methods.authenticate = function(user){
    console.log(user);
    return new Promise((res, rej) => {
        bcrypt.compare(user.password, this.passwordDigest, (err, result) => {
            if(err){
                rej('error in the compare');
            }else if(!result){
                rej('wrong hash');
            }else if(result){
                var token = jwt.sign(this._id, process.env.JWT_SECRET, {
                    expiresIn: 60*60*24
                });
                res({
                    user: this,
                    authToken: token
                });

            }

            rej('something bad happend');
        });
    });
    
};

var User = db.model('User', userSchema);

module.exports = User;
