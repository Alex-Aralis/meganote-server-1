var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.json([
    {
      title: 'Hardcoded note',
      body_html: 'My  super cool note.'
    },
    {
      title: 'Also hardcoded',
      body_html: 'Node is fun.'
    }
  ]);
});

app.listen(3030, function() {
  console.log('Listening on http://localhost:3030...');
});
