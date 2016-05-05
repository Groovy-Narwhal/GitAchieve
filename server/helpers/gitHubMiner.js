const https = require('https');
const fs = require('fs');

exports.getRepos = function(username, callback) {
  console.log('in gitHubMiner getRepos');
  var options = {
    host: 'https://api.github.com',
    port: '443',
    path: '/users/' + username + '/repos',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  
  var writeStream = fs.createWriteStream(fileName);
    
  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);
    writeStream.pipe(res);
    writeStream.on('end', function() {
      callback(writeStream);
    });
  });
  req.end();

  req.on('error', (err) => {
    console.error(err);
  });
  
};
