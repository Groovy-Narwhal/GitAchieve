const userRouter = require('express').Router();
const userController = require('./../controllers/userController.js');

// the following routes start from /api/v1/users

userRouter.route('/')
  .get(userController.retrieveAllUsers)
  .post(userController.addUser);

userRouter.route('/:id')
  .get(userController.retrieveUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

userRouter.route('/:id/repos')
  .get(userController.retrieveRepos)
  .post(userController.addRepo);

userRouter.route('/:id/friends')
  .get(userController.retrieveFriends)
  .post(userController.addFriend)
  .patch(userController.confirmOrRemoveFriend);

userRouter.route('/:id/stats')
  .get(userController.retrieveStats)
  .post(userController.addStats);

userRouter.route('/:id/achievements')
  .get(userController.retrieveAchievements)
  .post(userController.addAchievements);
  
module.exports = userRouter;
