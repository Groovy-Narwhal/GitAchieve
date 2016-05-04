const massive = require('massive');
const fs = require('fs');

// @todo: use an env variable here for dev vs. production servers
const connectionString = 'postgres://localhost:5432/gitachieve';

const db = massive.connectSync({connectionString: connectionString});

// workaround for the built-in Massive function that is supposed to create a method from the .sql 
// files - see  https://massive-js.readthedocs.io/en/latest/functions/

// read the schema test file - this will tell us if the users table exists
fs.readFile(__dirname + '/user_schema_test.sql', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  } else {
    // run the test file
    db.run(data, function(err, users) {
      if (err) {
        console.error(err);
      } else {
        // if the users table does not exist, drop all tables
        if (users[0].exists === false) {
          console.log('Users table does not exist; dropping tables');
          // read the drop tables file
          fs.readFile(__dirname + '/gitAchieve_drop.sql', 'utf8', function(err, data) {
            if (err) {
              console.error(err);
            } else {
              // run the drop tables file
              db.run(data, function(err, data) {
                if (err) {
                  console.error(err);
                } else {
                  console.log('Tables dropped successfully');
                  //once tables are dropped, read the schema file
                  fs.readFile(__dirname + '/gitAchieveSchema.sql', 'utf8', function(err, data) {
                    if (err) {
                      console.error(err);
                    } else {
                      // run the schema file to build the empty database
                      db.run(data, function(err, data) {
                        if (err) {
                          console.error(err);
                        } else {
                          console.log('Empty database built from gitAchieveSchema');
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          // if the users table exists, show this message and do nothing else
          console.log('Users table exists, not dropping tables');
        }
      }
    });
  }
});

module.exports = db;
