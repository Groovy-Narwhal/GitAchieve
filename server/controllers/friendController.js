const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const rp = require('request-promise');
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;


// GET at '/api/v1/users/:id/friends'
exports.retrieveFriends = function(req, res) {
  var queryId = req.params.id;
  // select all the secondary users associated with this user
  db.any(
    'SELECT u.id, u.username, u.email, u.avatar_url ' + 
    'FROM users_users uu ' +
    'INNER JOIN users u ' +
    'ON u.id = uu.secondary_user_id ' +
    'WHERE uu.confirmed_at IS NOT NULL ' +
    'AND uu.primary_user_id =($1)', 
    queryId)
    // select all the primary users associated with this user
    .then(data1 => {
      db.any(
        'SELECT u.id, u.username, u.email, u.avatar_url ' + 
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
  const competitionStart = pgp.as.date(new Date(req.body.competitionStart));
  const competitionEnd = pgp.as.date(new Date(req.body.competitionEnd));
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
            db.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~) ' +
              'VALUES ($9, $10, $11, $12, $13, $14) ' +
              'RETURNING *',
              ['users_users', 'uu', 'created_ga', 'competition_start', 'primary_user_id', 'secondary_user_id', 'primary_repo_id', 'competition_end',
              dbTimestamp, competitionStart, primaryUserId, secondaryUserId, primaryRepoId, competitionEnd])
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
  // 0 is for testing purposes there will normally be a secondary repo id present otherwise it must be an integer type
  const secondaryRepoId = req.body.secondaryRepoId || 57168943;
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
          'UPDATE users_users ' + 
          'SET confirmed_at=($1), ' +
          'secondary_repo_id=($2), ' +
          'last_active=($3) ' +
          'WHERE (users_users.primary_user_id=($4) ' +
          'AND users_users.secondary_user_id=($5)) ' +
          'RETURNING *', 
          [confirmedAt, secondaryRepoId, lastActive, primaryUserId, secondaryUserId])
          .then(data => {
            console.log('data', data);
            res.send(data)
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
    'AND uu.confirmed_at IS NULL ' +
    'AND uu.winner IS NULL',
    [secondaryIdCheck]
  ).then(data => {
    const currentDate = new Date();
    // for each data we want to make sure that they have a winner
    var filteredData = data.map(comp => {
      if (currentDate < new Date(comp.competition_end)) {
        return comp;
      }
    });
    if (filteredData.length === 0) {
      res.send([]);
    } else {
      console.log('WHAT UP')
      res.send(filteredData.reduce((acc, curr) => {
        return (curr !== undefined) ? acc.concat(curr) : acc;
      }, []));
    }
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
    'AND uu.confirmed_at IS NULL ' +
    'AND uu.winner IS NULL',
    [primaryIdCheck]
  ).then(data => {
    const currentDate = new Date();
    // for each data we want to make sure that they have a winner
    var filteredData = data.map(comp => {
      if (currentDate < new Date(comp.competition_end)) {
        return comp;
      }
    });
    if (filteredData.length === 0) {
      res.send([]);
    } else {
      res.send(filteredData.reduce((acc, curr) => {
        return (curr !== undefined) ? acc.concat(curr) : acc;
      }, []));
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error finding users_users connection');   
  })
}

// retrieve all entries in the user to user table in which confirmed at is not null
// GET at /api/v1/users/:id/successmatches
exports.checkApprovedRequests = function(req, res) {
   // this is the current users id
    var id = req.params.id;

    db.any('Select * from users_users uu ' +
      'WHERE uu.primary_user_id=($1) ' +
      'AND uu.confirmed_at IS NOT NULL ' +
      'AND uu.winner IS NULL',
      [id]
    ).then(data => {
      const currentDate = new Date();
      // for each data we want to make sure that they have a winner
      var filteredData = data.map(comp => {
        if (currentDate < new Date(comp.competition_end)) {
          return comp;
        }
      });
      if (filteredData.length === 0) {
        res.send([]);
      } else {
        res.send(filteredData.reduce((acc, curr) => {
          return (curr !== undefined) ? acc.concat(curr) : acc;
        }, []));
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error finding users_users connection');   
    })
  }

// retrieve all entries in the user to user table in which confirmed at is not null
// GET at /api/v1/users/:id/successmatches
exports.checkApprovedRequests2 = function(req, res) {
  // this is the current users id
  var id = req.params.id;

  db.any('Select * from users_users uu ' +
    'WHERE uu.secondary_user_id=($1) ' +
    'AND uu.confirmed_at IS NOT NULL ' +
    'AND uu.winner IS NULL',
    [id]
  ).then(data => {
    const currentDate = new Date();
    // for each data we want to make sure that they have a winner
    var filteredData = data.map(comp => {
      if (currentDate < new Date(comp.competition_end)) {
        return comp;
      }
    });
    if (filteredData.length === 0) {
      res.send([]);
    } else {
      res.send(filteredData.reduce((acc, curr) => {
        return (curr !== undefined) ? acc.concat(curr) : acc;
      }, []));
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error finding users_users connection');   
  })
}

// retrieve all entries in the user to user table in which competition date is in the past and update them to have a winner
// GET at /api/v1/users/:id/pastCompetitions
exports.checkPastCompetitions = function(req, res) {
  // this is the current users id
  const id = req.params.id;


  db.any('Select * from users_users uu ' +
    'WHERE uu.primary_user_id=($1) OR ' +
    'uu.secondary_user_id=($1)', [id])
  .then(data => {
    const currentDate = new Date();
    // for each data we want to make sure that they have a winner
    const filteredData = data.map(comp => {
      if (currentDate > new Date(comp.competition_end)) {
        return comp;
      }
    });
    var updatedCompetitions = [];
    const length = filteredData.reduce((acc, curr) => {return (curr !== undefined) ? acc + 1 : acc }, 0);
    var counter = 0;
    if (length === 0) {
      res.send([]);
    }
    filteredData.forEach(comp => {
      if (comp !== undefined) {
        counter = counter + 1;
        const winner = comp.winner;
        if (winner) {
          updatedCompetitions.push(comp);
          
          if (counter === length) {
            res.send(updatedCompetitions);
          }
        } else {
          const primary_user_id = comp.primary_user_id;
          const primary_repo_id = comp.primary_repo_id;
          const secondary_user_id = comp.secondary_user_id;
          const secondary_repo_id = comp.secondary_repo_id || 19366327;
          const competition_start = comp.competition_start;

          const primaryOptions = {
            uri: `${CALLBACKHOST}/api/v1/users/${primary_user_id}/commits/start`,
            method: 'GET',
            headers: {
              startdate: competition_start,
              repoid: primary_repo_id
            }
          };

          const secondaryOptions = {
            uri: `${CALLBACKHOST}/api/v1/users/${secondary_user_id}/commits/start`,
            method: 'GET',
            headers: {
              startdate: competition_start,
              repoid: secondary_repo_id
            }
          };

          rp(primaryOptions)
            .then(res => {
              const data = JSON.parse(res);
              const primaryCommitCount = data.reduce( (acc, cur) => acc + cur.commits.length, 0);
              return primaryCommitCount;
            }).
            then(primaryCommitCount => {
              rp(secondaryOptions)
                .then(res => {
                  const data = JSON.parse(res);
                  const secondaryCommitCount = data.reduce( (acc, cur) => acc + cur.commits.length, 0);
                  if (primaryCommitCount > secondaryCommitCount) {
                   return primary_user_id;
                  } else if (primaryCommitCount < secondaryCommitCount) {
                    return secondary_user_id;
                  }
                  return 1;
                })
                .then(winner => {
                  db.oneOrNone(
                    'SELECT * ' + 
                    'FROM users_users uu ' +
                    'WHERE uu.primary_user_id=($1) ' +
                    'AND uu.secondary_user_id=($2) ' +
                    'OR uu.primary_user_id=($2) ' +
                    'AND uu.secondary_user_id=($1)',
                    [primary_user_id, secondary_user_id])
                    .then(data => {
                      if (data !== null) {
                        db.oneOrNone(
                          'UPDATE users_users ' + 
                          'SET winner=($1) ' +
                          'WHERE (users_users.primary_user_id=($2) ' +
                          'AND users_users.secondary_user_id=($3)) ' +
                          'RETURNING *', 
                          [winner, primary_user_id, secondary_user_id])
                          .then(data => {
                            updatedCompetitions.push(data);
                            if (counter === length) {
                              res.send(updatedCompetitions);
                            }
                          })
                          .catch(error => {
                            console.error(error);
                            res.status(500).send('Error updating users_users connection');                
                          });
                        }
                    })
                })
            })
            .catch(err => console.error(err));
        }
        
      }
    })
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error finding users_users connection');   
  });
}
