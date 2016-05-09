const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

// GET at '/api/v1/users/:id/friends'

exports.retrieveFriends = function(req, res) {
  var queryId = req.params.id;
  // select all the secondary users associated with this user
  db.one(
    'SELECT u.id, u.username, u.email ' + 
    'FROM users_users uu ' +
    'INNER JOIN users u ' +
    'ON u.id = uu.secondary_user_id ' +
    'WHERE uu.confirmed_at IS NOT NULL ' +
    'AND uu.primary_user_id =($1)', 
    queryId)
    // select all the primary users associated with this user
    .then(data1 => {
      db.one(
        'SELECT u.id, u.username, u.email ' + 
        'FROM users_users uu ' +
        'INNER JOIN users u ' +
        'ON u.id = uu.primary_user_id ' +
        'WHERE uu.confirmed_at IS NOT NULL ' +
        'AND uu.secondary_user_id =($1)', 
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

// POST at '/api/v1/users/:id/friends'
exports.addFriend = function(req, res) {
  // this is the person sending the invitation to compete
  const primaryUserId = req.params.id; 
  // this is the person receiving the invitation to compete
  const secondaryUserId = req.body.secondaryUserId;
  const secondaryUsername = req.body.secondaryUsername;
  const secondaryUserEmail = req.body.secondaryUserEmail;
  const dbTimestamp = pgp.as.date(new Date());
  
  // check if the secondary user exists
  db.one(
    'SELECT * FROM users WHERE id=($1)',
    secondaryUserId)
    .then(data => {
      // if secondary user doesn't exist, add to users table with signed_up = false
      if (data.created_ga === null) {
        db.any(
          'INSERT INTO users (id, username, email, created_ga, signed_up) ' +
          'VALUES ($1, $2, $3, $4, $5)',
          [secondaryUserId, secondaryUsername, secondaryUserEmail, dbTimestamp, false])
          .then(data => {
            console.log('Secondary user created with username: ' + secondaryUsername + 
            ' and email: ' + secondaryUserEmail + ', signed_up = false');
            // once the secondary user exists, add a connection in the user_users table
            // the confirmed_at column will be null, showing that the relationship has not been
            // confirmed by the secondary user yet
            db.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~) ' +
              'VALUES ($6, $7, $8) ' +
              'RETURNING *',
              ['users_users', 'uu', 'created_ga', 'primary_user_id', 'secondary_user_id', 
              dbTimestamp, primaryUserId, secondaryUserId])
              .then((data) => {
                res.send(data);
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send('Error adding user_user connnection');
              });
          })
          .catch(error => {
            console.error(error);
            res.status(500).send(error);
          });
      } else {
        // if the secondary user exists, check if there is already a user_user connection
        db.any(
          'SELECT * FROM $1~ AS $2~' +
          'WHERE $2~.$3~ = $4' +
          'AND $2~.$5~ = $6',
          ['users_users', 'uu', 'primary_user_id', primaryUserId, 'secondary_user_id', secondaryUserId])
          .then(data => {
            // if there is not a connection between the users, add a connection in the user_users table
            // the confirmed_at column will be null, showing that the relationship has not been
            // confirmed by the secondary user yet
            if (data.length === 0) {
              db.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~) ' +
                'VALUES ($6, $7, $8) ' +
                'RETURNING *',
                ['users_users', 'uu', 'created_ga', 'primary_user_id', 'secondary_user_id', 
                dbTimestamp, primaryUserId, secondaryUserId]) 
                .then((data) => {
                  res.send(data);
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error adding user_user connnection');
                });             
            } else {
              console.log('Connection already exists between primary user: ' 
                + primaryUserId + ' and secondary user: ' + secondaryUserId);
              res.send('Connection already exists');
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).send('Error querying user_users table');     
          });
      }
    });
};
