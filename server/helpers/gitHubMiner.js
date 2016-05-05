const https = require('https');
const fs = require('fs');

exports.getRepos = function(username, callback) {
  console.log('in gitHubMiner getRepos');
  var options = {
    host: 'api.github.com',
    port: '443',
    path: '/users/' + username + '/repos',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };
  
  var request = https.request(options, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback(data);
    });
  });
  
  request.end();

};
  
  
    /*
  app.get('/board',function(req,res) {
    if (!req.session.uid) {
        return res.redirect('/');
    }
    var repos,
        opts = {
      host: "api.github.com",
      path: '/user/repos?access_token=' + req.session.oauth,
      method: "GET"
    },
      request = https.request(opts, function(resp) {
        var data = "";
        resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
      data += chunk;
    });
    resp.on('end', function () {
      repos = JSON.parse(data); 
      res.render('board',{username: req.session.uid, repos: repos});
    });
      });
    request.end();
    */
  
  
  // var writeStream = fs.createWriteStream('./tempRepo.js');
    
  // var req = https.request(options, (res) => {
  //   console.log('statusCode: ', res.statusCode);
  //   console.log('headers: ', res.headers);
  //   writeStream.pipe(res);
  //   writeStream.on('end', function() {
  //     callback(writeStream);
  //   });
  // });
  // req.end();

  // req.on('error', (err) => {
  //   console.error(err);
  // });

