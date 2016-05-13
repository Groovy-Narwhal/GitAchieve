var SEND_GRID_API = require('./../../server/config/sendGridKey');
var sendgrid  = require('sendgrid')(SEND_GRID_API.key);

module.exports = (app) => {
  app.get('/send-email', (req, res) => {

    var email     = new sendgrid.Email({
      to:       'adamrgisom@gmail.com',
      from:     'gitachieve@gmail.com',
      subject:  'Subject goes here',
      text:     'Hello world'
    });

    console.log('in /api/v1/send-email');

    sendgrid.send(email, function(err, json) {
      if (err) { return console.error(err); }
      console.log(json);
    });

  })
};
