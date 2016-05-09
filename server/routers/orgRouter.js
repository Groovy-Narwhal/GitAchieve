const orgRouter = require('express').Router();
const orgController = require('../controllers/orgController.js');
const pullRequestController = require('../controllers/pullRequestController.js');

// the following routes start from /api/v1/orgs
orgRouter.route('/:id/orgs')
  .patch(orgController.retrieveOrgs)

orgRouter.route('/:id/pullrequests')
  .patch(pullRequestController.retrievePullRequests)




orgRouter.route('/:orgname')
  // .get(orgController.retrieveOne);

orgRouter.route('/:orgname/stats')
  .get(orgController.retrieveStats)
  .post(orgController.addStats);

orgRouter.route('/:orgname/achievements')
  .get(orgController.retrieveAchievements)
  .post(orgController.addAchievements);

module.exports = orgRouter;
