require('dotenv').load();
var express = require('express');
var db = require('mongoose');

db.connect('mongodb://node:myMongoPW!@ds059135.mlab.com:59135/meganote');
var app = express();

var NoteSchema = db.Schema({
  title: String,
  body_html: String,
  body_text: String,
  updated_at: { type: Date, default: Date.now }
});
var Note = db.model('Note', NoteSchema);

app.get('/', function(req, res) {
  Note
    .find()
    .then(function(notes) {
      res.json(notes);
    });
});

app.listen(3030, function() {
  console.log('Listening on http://localhost:3030...');
});
