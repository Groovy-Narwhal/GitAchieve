const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

// GET at '/api/v1/users/:id/friends'

exports.retrieveFriends = function(req, res) {
  var queryId = req.params.id;
  // select all the secondary users associated with this user
  db.one(
    ('SELECT u.id, u.username, u.email ' + 
    'FROM users_users uu ' +
    'INNER JOIN users u ' +
    'ON u.id = uu.secondary_user_id ' +
    'WHERE uu.confirmed_at IS NOT NULL ' +
    'AND uu.primary_user_id =($1)'), 
    queryId)
    // select all the primary users associated with this user
    .then(data1 => {
      db.one(
        ('SELECT u.id, u.username, u.email ' + 
        'FROM users_users uu ' +
        'INNER JOIN users u ' +
        'ON u.id = uu.primary_user_id ' +
        'WHERE uu.confirmed_at IS NOT NULL ' +
        'AND uu.secondary_user_id =($1)'), 
        queryId)
      .then(data2 => {
        // if both queries are successful, send the combined data back
        res.send(data1.concat(data2));
      });
    })
    .catch(error => {
      console.error(error);
      if (error.code === 0) {
        res.send(404);
      } else {
      res.status(500).send(error);
      }
    });
};
