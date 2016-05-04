const userRouter = require('express').Router();
const userController = require('./../controllers/userController.js');

// the following routes start from /api/v1/users

userRouter.route('/')
  .get(userController.retrieve)
  .post(userController.addOne);

userRouter.route('/:id')
  .get(userController.retrieveOne)
  .patch(userController.updateOne)
  .delete(userController.deleteOne);

userRouter.route('/:id/repos')
  .get(userController.retrieveRepos);

userRouter.route('/:id/friends')
  .get(userController.retrieveFriends)
  .post(userController.addFriend);

userRouter.route('/:id/stats')
  .get(userController.retrieveStats)
  .post(userController.addStats);

userRouter.route('/:id/achievements')
  .get(userController.retrieveAchievements)
  .post(userController.addAchievements);
  
module.exports = userRouter;
