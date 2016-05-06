const promise = require('bluebird');
const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const sql = require('./sql/sql');

const config = {
  host: 'localhost', // server name or IP address;
  port: 5432,
  database: 'gitachieve',
  user: 'postgres',
  password: ''
};

const db = pgp(config);

// check if the users table exists
db.query(sql.test)
  .then((data) => {
    // if the users table does not exist, drop all tables and rebuild from schema
    if (!data[0].exists) {
      console.log('Users table does not exist; dropping tables');
      db.query(sql.drop)
        .then((data) => {
          db.query(sql.build)
            .then((data) => {
              console.log('Empty database built from GitAchieve schema');
            });
        });  
    // if the users table exists, do nothing     
    } else {
      console.log('Users table exists; not dropping tables');
    }
  })  
  .catch((error) => {
    console.error('Error: ', error);
  })
  .finally(() => pgp.end());
  
exports.db = db;
exports.pgp = pgp;
