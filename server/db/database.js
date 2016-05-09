const promise = require('bluebird');
const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const sql = require('./sql/sql');
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const diag = require('./diagnostics');
diag.init(options);

const config = {
  host: HOST, // server name or IP address;
  port: 5432,
  database: 'gitachieve',
  user: 'postgres',
  password: ''
};

const db = pgp(config);

db.tx(t=> t.one(sql.test)
  .then((data) => {
    // if users table doesn't exist, rebuild database
    if (!data.exists) {
      console.log('Rebuilding database');
      return t.batch([t.none(sql.drop), t.none(sql.build)]);
    } else {
      console.log('Users table exists, not rebuilding database');
    }
  })
  .catch(error=> {
    console.log('error:', error);
  })
  .finally(pgp.end)
);
  
exports.db = db;
exports.pgp = pgp;
