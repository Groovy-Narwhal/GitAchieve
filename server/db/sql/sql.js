const QueryFile = require('pg-promise').QueryFile;

// links to external query files
const sql = function (file) {
  return new QueryFile(__dirname + '/' + file, {minify: true});
};

// sets up the queries we want to use
const sqlProvider = {
  test: sql('user_table_test.sql'),
  drop: sql('drop_database.sql'),
  build: sql('build_database.sql')
};

module.exports = sqlProvider;
