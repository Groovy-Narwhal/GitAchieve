var massive = require('massive');
var fs = require ('fs');

// @todo: use an env variable here for dev vs. production servers
var connectionString = 'postgres://localhost:5432/gitachieve';

var db = massive.connectSync({connectionString: connectionString});

// workaround for the built-in Massive function that is supposed to create a method from the .sql 
// files - see line 32 and https://massive-js.readthedocs.io/en/latest/functions/
var userSchema = fs.readFileSync(__dirname + '/user_schema.sql', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  }
});

// if the users table is empty, build it
db.run('select * from users', function(err, users) {
  if (err) {
    console.error(err);
  } else {
    if (users.length === 0) {
      console.log('building users table');
      db.run(userSchema, function(error, res) {
        if (error) {
          console.error('Error in userSchema, ', error);
        } else {
          console.log('Created users table from userSchema');
        }
      });
    
    // this version should read the user_schema.sql file within this folder
    // and make it into a method on the db instance
    // ** this is not working, it seems to load after the run command is called
    
    // db.user_schema(function(error, response) {
    //   if (error) {
    //     console.error('Error in user_schema, ', error);
    //   } else {
    //     console.log('Created table from user_schema');
    //   }
    // });
    }
  }
});

module.exports = db;
