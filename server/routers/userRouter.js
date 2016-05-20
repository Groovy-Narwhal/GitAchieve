var userRouter = require('express').Router();
var userController = require('./../controllers/userController.js');
var repoController = require('./../controllers/repoController.js');
var friendController = require('./../controllers/friendController.js');
var statController = require('./../controllers/statController.js');
var commitController = require('./../controllers/commitController.js');
var commitStartController = require('./../controllers/commitStartController.js');
var branchController = require('./../controllers/branchController.js');
var competitionUpdate = require('./../helpers/competitionUpdate.js');

// the following routes start from /api/v1/users
userRouter.route('/')
  .get(userController.retrieveAllUsers)
  .post(userController.addUser);

userRouter.route('/:id')
  .get(userController.retrieveUser)
  .patch(userController.patchUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);
  
userRouter.route('/:id/repo')
  .get(repoController.retrieveRepoById);  

userRouter.route('/:id/repos')
  .get(repoController.retrieveRepos)
  .post(repoController.addRepo)
  .patch(repoController.updateRepos);

userRouter.route('/:id/repos/branches')
  .get(branchController.retrieveBranches)
  .patch(branchController.updateBranches);

userRouter.route('/:id/stats')
  .get(statController.retrieveStats)
  .patch(statController.updateStats);
  
userRouter.route('/:id/commits')
  .get(commitController.retrieveCommits)
  .patch(commitController.updateCommits)
  .put(commitController.updateCompetition);

userRouter.route('/:id/commits/start')
  .get(commitStartController.retrieveCompetition); 

userRouter.route('/:id/friends')
  .get(friendController.retrieveFriends)
  .post(friendController.addFriend)
  .patch(friendController.confirmFriend);

userRouter.route('/:id/receivedmatches')
  .get(friendController.checkForFriendRequests);

userRouter.route('/:id/requestedmatches')
  .get(friendController.checkForSentRequests);

userRouter.route('/:id/successmatches')
  .get(friendController.checkApprovedRequests);

userRouter.route('/:id/successmatches2')
  .get(friendController.checkApprovedRequests2);

userRouter.route('/:id/pastcompetitions')
  .get(friendController.checkPastCompetitions);

// WORKER
userRouter.route('/:primaryid/:secondaryid/update')
  .put(update.updateCompetition);
  
module.exports = userRouter;
