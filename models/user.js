var db = require('../config/db');
var sanitizeHtml = require('sanitize-html');
var htmlToText = require('html-to-text');

var userSchema = db.Schema({
  name: String,
  username: String,
  hash: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

var User = db.model('User', userSchema);

module.exports = User;
