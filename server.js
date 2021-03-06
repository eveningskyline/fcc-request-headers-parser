 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
const os = require('os');

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://debonair-caption.glitch.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.route('/api/whoami')
    .get(function(req, res) {
		  var whoAmIObj = undefined
      var myJSON = undefined
      var dateToReturn = null
      
      var ipAddress = req.headers["x-forwarded-for"]
      var addresses = ipAddress.split(',')
      ipAddress = addresses[0]
  
      var userLanguage = req.headers["accept-language"]
      var userLanguages = userLanguage.split(',')
      userLanguage = userLanguages[0]

      whoAmIObj = { "ipaddress": ipAddress,
                  "language": userLanguage,
                  "software": req.headers}
  
      myJSON = JSON.stringify(whoAmIObj);
      res.end(myJSON);

      
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

