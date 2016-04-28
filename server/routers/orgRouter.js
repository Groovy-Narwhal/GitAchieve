var orgRouter = require('express').Router();
var orgController = require('../controllers/orgController.js');

orgRouter.route('/:orgname')
  .get(orgController.retrieveOne);

orgRouter.route('/:orgname/achievements')
  .get(orgController.retrieveAchievements);

module.exports = orgRouter;
