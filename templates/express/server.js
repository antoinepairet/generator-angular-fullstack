'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    formsAngular = require('forms-angular');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');<% if(mongoPassportUser) { %>

// Passport Configuration
var passport = require('./lib/config/passport');<% } %>

// Setup Express
var app = express();
require('./lib/config/express')(app);

var Schema = mongoose.Schema;

var ApplicantSchema = new Schema({
    surname: {type:String, required:true, index:true},
    forename: {type:String, index:true}
});

var Applicant = mongoose.model('Applicant', ApplicantSchema);

var DataFormHandler = new (formsAngular)(app);
DataFormHandler.addResource('applicant', Applicant);   // Create and add more schemas to taste

require('./lib/routes')(app);

// Start server
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
