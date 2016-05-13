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
  const primaryRepoId = req.body.primaryRepoId;
  const competitionStart = pgp.as.date(new Date());
  const dbTimestamp = pgp.as.date(new Date());
  // check if the secondary user exists
  db.one('SELECT * FROM users WHERE id=($1)',
    secondaryUserId)
    .then(data => {
      db.any(
        'SELECT * FROM $1~ AS $2~ ' +
        'WHERE ($2~.$3~ = $4 ' +
        'AND $2~.$5~ = $6) ' +
        'OR ($2~.$3~ = $6 ' +
        'AND $2~.$5~ = $4)',
        ['users_users', 'uu', 'primary_user_id', primaryUserId, 'secondary_user_id', secondaryUserId])
        .then(data => {
          // if there is not a connection between the users, add a connection in the user_users table
          // the confirmed_at column will be null, showing that the relationship has not been
          // confirmed by the secondary user yet
          if (data.length === 0) {
            db.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~) ' +
              'VALUES ($8, $9, $10, $11, $12) ' +
              'RETURNING *',
              ['users_users', 'uu', 'created_ga', 'competition_start', 'primary_user_id', 'secondary_user_id', 'primary_repo_id',
              dbTimestamp, competitionStart, primaryUserId, secondaryUserId, primaryRepoId])
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
        });
  });
};


// PATCH at /api/v1/users/:id/friends to confirm a friendship
exports.confirmFriend = function(req, res) {
  // this is the person accepting the invitation to compete
  var secondaryUserId = req.params.id; 
  // this is the person who sent the invitation to compete
  var primaryUserId = req.body.primaryUserId;
  const secondaryRepoId = req.body.secondaryRepoId;
  var confirmedAt = pgp.as.date(new Date());
  const lastActive = pgp.as.date(new Date());

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
          'SET confirmed_at =($1) AND ' +
          'SET secondary_repo_id =($2) AND ' +
          'SET last_active =($3) AND ' +
          'WHERE uu.primary_user_id=($4) ' +
          'AND uu.secondary_user_id=($5) ' +
          'RETURNING *', 
          [confirmedAt, secondaryRepoId, lastActive, primaryUserId, secondaryUserId])
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


// retrieve all entries in the user to user table in which someone else sent you a request to compete and you have not yet accepted the match
// GET at /api/v1/users/:id/receivedmatches
exports.checkForFriendRequests = function(req, res) {
  // this is the current users id
  var secondaryIdCheck = req.params.id;

  db.any('Select * from users_users uu ' +
    'WHERE uu.secondary_user_id=($1) ' +
    'AND uu.confirmed_at IS NULL',
    [secondaryIdCheck]
  ).then(data => {
    console.log('Data of friend Requests received not accepted', data);
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error finding users_users connection');   
  })
}

// retrieve all entries in the user to user table in which you sent a request to compete and they have not yet accepted the match
// GET at /api/v1/users/:id/requestedmatches
exports.checkForSentRequests = function(req, res) {
  // this is the current users id
  var primaryIdCheck = req.params.id;

  db.any('Select * from users_users uu ' +
    'WHERE uu.primary_user_id=($1) ' +
    'AND uu.confirmed_at IS NULL',
    [primaryIdCheck]
  ).then(data => {
    console.log('Data of friend Requests sent not accepted', data);
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error finding users_users connection');   
  })
}