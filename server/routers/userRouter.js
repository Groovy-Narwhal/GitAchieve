const userRouter = require('express').Router();
const userController = require('./../controllers/userController.js');
const repoController = require('./../controllers/repoController.js');
const friendController = require('./../controllers/friendController.js');


// the following routes start from /api/v1/users

userRouter.route('/')
  .get(userController.retrieveAllUsers)
  .post(userController.addUser);

userRouter.route('/:id')
  .get(userController.retrieveUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

userRouter.route('/:id/repos')
  .patch(repoController.retrieveRepos)
  .post(repoController.addRepo);

userRouter.route('/:id/friends')
  .get(friendController.retrieveFriends);
//   .post(friendController.addFriend)
//   .patch(friendController.confirmOrRemoveFriend);

// userRouter.route('/:id/stats')
//   .get(userController.retrieveStats)
//   .post(userController.addStats);

// userRouter.route('/:id/achievements')
//   .get(userController.retrieveAchievements)
//   .post(userController.addAchievements);
  
module.exports = userRouter;
