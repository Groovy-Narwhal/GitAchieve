const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

// GET at '/api/v1/users/:id/friends'

exports.retrieveFriends = function(req, res) {
  var queryId = req.params.id;
  // select all the secondary users associated with this user
  db.any(
    'SELECT u.id, u.username, u.email ' + 
    'FROM users_users uu ' +
    'INNER JOIN users u ' +
    'ON u.id = uu.secondary_user_id ' +
    'WHERE uu.confirmed_at IS NOT NULL ' +
    'AND uu.primary_user_id =($1)', 
    queryId)
    // select all the primary users associated with this user
    .then(data1 => {
      db.any(
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

// this is an alternate version that uses transactions
// it's not working yet

exports.addFriend2 = function(req, res) {
  // this is the person sending the invitation to compete
  const primaryUserId = req.params.id; 
  // this is the person receiving the invitation to compete
  const secondaryUserId = req.body.secondaryUserId;
  const secondaryUsername = req.body.secondaryUsername;
  const secondaryUserEmail = req.body.secondaryUserEmail;
  const dbTimestamp = pgp.as.date(new Date());
  
  // check if the secondary user exists
  db.tx(t => t.oneOrNone('SELECT * FROM $1~ WHERE $2~=($3)', ['users', 'id', secondaryUserId])
    .then(data => { 
      console.log('select * data', data);
      // ** HELPER FUNCTIONS **
      // adds a user with signed_up = false
      var addUserQuery = t.one(
        'INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~) ' +
        'VALUES ($7, $8, $9, $10, $11) ' +
        'RETURNING *',
        ['users', 'id', 'username', 'email', 'created_ga', 'signed_up', 
        secondaryUserId, secondaryUsername, secondaryUserEmail, dbTimestamp, false]);
      // adds a connection between users
      var addConnectionQuery = t.one(
        'INSERT INTO $1~ AS $2~ ($3~, $4~, $5~) ' +
        'VALUES ($6, $7, $8) ' +
        'RETURNING *',
        ['users_users', 'uu', 'created_ga', 'primary_user_id', 'secondary_user_id', 
        dbTimestamp, primaryUserId, secondaryUserId]);
      // checks if a connection exists
      var checkConnectionQuery = t.one(
        'SELECT * FROM $1~ AS $2~' +
        'WHERE $2~.$3~ = $4' +
        'AND $2~.$5~ = $6',
        ['users_users', 'uu', 'primary_user_id', primaryUserId, 'secondary_user_id', secondaryUserId]);
      var deleteConnectionQuery = t.one(
        'DELETE FROM $1~ AS $2~' +
        'WHERE $2~.$3~ = $4' +
        'AND $2~.$5~ = $6 ' +
        'RETURNING *',
        ['users_users', 'uu', 'primary_user_id', primaryUserId, 'secondary_user_id', secondaryUserId]);
      // ** CALL HELPER FUNCTIONS **
      // if the secondary user does not exist, add them and then add a connection 
      if (data === null) {
        return t.batch([addUserQuery, addConnectionQuery]);
      } else {
        // return checkConnectionQuery;
      // if the secondary user has been created, check if there is a connection  
        return t.batch([checkConnectionQuery]);
      }
    })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log('catch tx error');
      console.error(error);
      res.status(500).send(error);
    })
    .finally(pgp.end)
  );  
}; 

// PATCH at /api/v1/users/:id/friends to confirm a friendship
exports.confirmOrRemoveFriend = function(req, res) {
  // this is the person accepting the invitation to compete
  var secondaryUserId = req.params.id; 
  // this is the person who sent the invitation to compete
  var primaryUserId = req.body.primaryUserId;
  var status = pgp.as.date(new Date());
  // if removeFriend = true, replace status with null 
  if (req.body.remove) {
    status = null;
  } 
  // find user_users connection
  db.oneOrNone(
    'SELECT * ' + 
    'FROM users_users uu ' +
    'WHERE uu.primary_user_id=($1) ' +
    'AND uu.secondary_user_id=($2)', 
    [primaryUserId, secondaryUserId])
    .then(data => {
      if (data !== null) {
        db.oneOrNone(
          'UPDATE users_users uu ' + 
          'SET confirmed_at =($1) ' +
          'WHERE uu.primary_user_id=($2) ' +
          'AND uu.secondary_user_id=($3) ' +
          'RETURNING *', 
          [status, primaryUserId, secondaryUserId])
          .then(data => {
            res.send(data);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send('Error updating users_users connection');                
          });
      } else {
        res.status(404).send('Error, users_users connection not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error finding users_users connection');      
    });
};
