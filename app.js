require('dotenv').load();
var bcrypt = require('bcryptjs');
var express = require('express');
var Note = require('./models/note');
var User = require('./models/user');
var bodyParser = require('body-parser');

var app = express();

const WORK_FACTOR = 10;

// Middleware
app.use(function(req, res, next) {
  // Allow CORS.
  res.header('Access-Control-Allow-Origin', '*');

  // Allow Content-Type header (for JSON payloads).
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Allow more HTTP verbs.
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');

  // Continue processing the request.
  next();
});

// Body parsing for JSON POST/PUT payloads
app.use(bodyParser.json());

// READ all notes
app.get('/', function(req, res) {
  Note
    .find()
    .sort({ updated_at: 'desc' })
    .then(function(notes) {
      res.json(notes);
    });
});

// READ one note
app.get('/:id', function(req, res) {
  Note
    .findOne({
      _id: req.params.id
    })
    .then(function(note) {
      res.json(note);
    });
});

// CREATE a note
app.post('/', function(req, res) {
  var note = new Note({
    title: req.body.note.title,
    body_html: req.body.note.body_html
  });

  note
    .save()
    .then(function(noteData) {
      res.json({
        message: 'Successfully created note',
        note: noteData
      });
    });
});

app.post('/users', (req, res) => {
    if(req.body.user.password !== req.body.user.passwordConfirmation){
        res.status(500).json({
            message: 'user.password and user.passwordConfirmation do not match.',
        });
        
        return;
    }


    bcrypt.hash(req.body.user.password, WORK_FACTOR, (err, hash) => {
        let user = new User({
            name: req.body.user.name,
            username: req.body.user.username,
            hash,
            work_factor: WORK_FACTOR,
        });

        user.save().then(
            userData => res.json({
                message: 'User successfully saved',
                user,
            })
        )
    });
});
// UPDATE a note
app.put('/:id', function(req, res) {
  Note
    .findOne({
      _id: req.params.id
    })
    .then(
      function(note) {
        note.title = req.body.note.title;
        note.body_html = req.body.note.body_html;
        note
          .save()
          .then(
            function() {
              res.json({
                message: 'Your changes have been saved.',
                note: note
              });
            },
            function(result) {
              res.json({ message: 'Aww, cuss!' });
            }
          );
      },
      function(result) {
        res.json({ message: 'Aww, cuss!' });
      });
});

app.delete('/:id', function(req, res) {
  Note
    .findOne({
      _id: req.params.id
    })
    .then(function(note) {
      note
        .remove()
        .then(function() {
          res.json({
            message: 'That note has been deleted.',
            note: note
          })
        });
    });
});

// CREATE a user
app.post('/users', function(req, res) {
  res.json({
    msg: 'HOORAY!'
  });
});

app.listen(3030, function() {
  console.log('Listening on http://localhost:3030...');
});
