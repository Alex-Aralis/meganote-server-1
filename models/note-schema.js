let db = require('../config/db');
let sanitizeHtml = require('sanitize-html');
let htmlToText = require('html-to-text');


let noteSchema = db.Schema({
    title: String,
    body_html: String,
    body_text: String,
    updated_at: { type: Date, default: Date.now }
});

noteSchema.pre('save', function(next) {
    this.body_text = htmlToText.fromString(this.body_html);
    this.body_html = sanitizeHtml(this.body_html);
    this.updated_at = Date.now();
    next();
});

module.exports = noteSchema;
