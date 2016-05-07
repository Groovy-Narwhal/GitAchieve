const promise = require('bluebird');
const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const sql = require('./sql/sql');
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;

const config = {
  host: HOST, // server name or IP address;
  port: 5432,
  database: 'gitachieve',
  user: 'postgres',
  password: ''
};

const db = pgp(config);

// check if the users table exists
db.tx(t=> {
  t.one(sql.test)
    .then(data=> {
      return !!data.exists || t.batch([
        t.none(sql.drop),
        t.none(sql.build)
        ])
        .then(()=>false);
    });
  })
  .then(rebuilt=> {
    if (rebuilt) {
      console.log('Database was rebuilt.');
    } else {
      console.log('Users table already exists; not rebuilding database.');
    }
  })
  .catch(error=> {
    console.log("ERROR:", error);
  })
  .finally(pgp.end);
  
exports.db = db;
exports.pgp = pgp;
