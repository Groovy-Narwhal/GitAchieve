var massive = require('massive');

// @todo: use an env variable here for dev vs. production servers
var connectionString = 'postgres://localhost:5432/gitachieve';

var database = massive.connectSync({connectionString: connectionString});

database.user_schema(function(err, users) {
  if (err) {
    console.error('Error in user_schema, ', err);
  } else {
    console.log('Created table from user_schema');
  }
});

module.exports = database;
