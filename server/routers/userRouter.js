const userRouter = require('express').Router();
const userController = require('./../controllers/userController.js');
const repoController = require('./../controllers/repoController.js');
const friendController = require('./../controllers/friendController.js');
const statController = require('./../controllers/statController.js');
const commitController = require('./../controllers/commitController.js');


// the following routes start from /api/v1/users

userRouter.route('/')
  .get(userController.retrieveAllUsers)
  .post(userController.addUser);

userRouter.route('/:id')
  .get(userController.retrieveUser) // using
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

userRouter.route('/:id/repos')
  .get(repoController.retrieveRepos)
  .post(repoController.addRepo)
  .patch(repoController.updateRepos);

userRouter.route('/:id/stats')
  .get(statController.retrieveStats)
  .patch(statController.updateStats);
  
userRouter.route('/:id/commits')
  // .get(commitController.retrieveCommits)
  .patch(commitController.updateCommits);  

userRouter.route('/:id/friends')
  .get(friendController.retrieveFriends)
  .post(friendController.addFriend) // using
  .patch(friendController.confirmFriend); // using

userRouter.route('/:id/receivedmatches')
  .get(friendController.checkForFriendRequests); // using

userRouter.route('/:id/requestedmatches')
  .get(friendController.checkForSentRequests); // using

userRouter.route('/:id/successmatches')
  .get(friendController.checkApprovedRequests); // using

userRouter.route('/:id/successmatches2')
  .get(friendController.checkApprovedRequests2); // using

// userRouter.route('/:id/achievements')
//   .get(userController.retrieveAchievements)
//   .post(userController.addAchievements);
  
module.exports = userRouter;
