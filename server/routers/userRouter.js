var userRouter = require('express').Router();
var userController = require('./../controllers/userController.js');

userRouter.route('/')
  .get(userController.retrieve)
  .post(userController.addOne);

userRouter.route('/:username')
  .get(userController.retrieveOne)
  .patch(userController.updateOne)
  .delete(userController.deleteOne);

userRouter.route('/:username/repos')
  .get(userController.retrieveRepos);

userRouter.route('/:username/friends')
  .get(userController.retrieveFriends)
  .post(userController.addFriend);

userRouter.route('/:username/stats')
  .get(userController.retrieveStats)
  .post(userController.addStats);

userRouter.route('/:username/achievements')
  .get(userController.retrieveAchievements)
  .post(userController.addAchievements);

module.exports = userRouter;
