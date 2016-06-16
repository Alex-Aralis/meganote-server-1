var db = require('mongoose');
db.connect('mongodb://node:myMongoPW!@ds059135.mlab.com:59135/meganote');

module.exports = db;
