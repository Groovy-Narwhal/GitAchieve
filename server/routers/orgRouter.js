var orgRouter = require('express').Router();
var orgController = require('../controllers/orgController.js');

orgRouter.route('/:orgname')
  .get(orgController.retrieveOne);

orgRouter.route('/:orgname/stats')
  .get(orgController.retrieveStats)
  .post(orgController.addStats);

orgRouter.route('/:orgname/achievements')
  .get(orgController.retrieveAchievements)
  .post(orgController.addAchievements);

module.exports = orgRouter;
