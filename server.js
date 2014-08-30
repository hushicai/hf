/**
 * @file mock server
 * @author hushicai(bluthcy@gmail.com)
 */

var express = require('express');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var app = express();

app.set('jsonp callback', true);

app.use(serveIndex(__dirname));
app.use(serveStatic(__dirname));

app.get('/jsonp', function(req, res) {
    res.jsonp({name: 'hushicai'});
});

module.exports = app;
