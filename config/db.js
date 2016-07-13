var db = require('mongoose');

//set ES6 promises as default
db.Promise = global.Promise;

db.connect(process.env.DB_URI);

module.exports = db;
