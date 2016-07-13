var db = require('../config/db');
let noteSchema = require('./note-schema');

module.exports = db.model('Note', noteSchema);

