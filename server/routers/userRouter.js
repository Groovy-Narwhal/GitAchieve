var userRouter = require('express').Router();
var userController = require('./../controllers/userController.js');

// the following routes start from /api/v1/users

userRouter.route('/')
  .get(userController.retrieve)
  .post(userController.addOne);

// for development use only
userRouter.route('/addSampleData')
  .get(userController.addSampleData);

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
