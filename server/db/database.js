var massive = require('massive');
var fs = require ('fs');

// @todo: use an env variable here for dev vs. production servers
var connectionString = 'postgres://localhost:5432/gitachieve';

var db = massive.connectSync({connectionString: connectionString});

var user_schema = fs.readFileSync(__dirname + '/user_schema.sql', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  }
});

db.run('select * from users', function(err, users) {
  if (err) {
    console.error(err);
  } else {
    if (users.length === 0) {
      console.log('building users table');
      db.run(user_schema, function(err, res) {
        if (err) {
          console.error('Error in user_schema, ', err);
        } else {
          console.log('Created table from user_schema');
        }
      });
    }
  }
});

module.exports = db;
