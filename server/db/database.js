var promise = require('bluebird');
var options = {
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var sql = require('./sql/sql');
var PORT = require('../config/config-settings').PORT;
var HOST = require('../config/config-settings').HOST;
var diag = require('./diagnostics');
var DB_DEPLOY_CONFIG = require('../config/dbConfig').DB_DEPLOY_CONFIG;
diag.init(options);

var DB_LOCAL_CONFIG = {
  host: HOST, // server name or IP address;
  port: 5432,
  database: 'gitachieve',
  user: 'postgres',
  password: ''
};

var dbConfig;

if (process.env.NODE_ENV !== 'production') {
  dbConfig = DB_LOCAL_CONFIG;
} else {
  dbConfig = DB_DEPLOY_CONFIG;
}

var db = pgp(dbConfig);

db.tx(t=> t.one(sql.test)
  .then((data) => {
    //  if users table doesn't exist, rebuild database
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
