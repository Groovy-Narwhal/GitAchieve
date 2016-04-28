var userRouter = require('express').Router();
var userController = require('./../controllers/userController.js');

userRouter.route('/:username')
  .get(userController.retrieveOne);

userRouter.route('/:username/repos')
  .get(userController.retrieveRepos);

userRouter.route('/:username/friends')
  .get(userController.retrieveFriends);

userRouter.route('/:username/stats')
  .get(userController.retrieveStats);

userRouter.route('/:username/achievements')
  .get(userController.retrieveAchievements);

module.exports = userRouter;
