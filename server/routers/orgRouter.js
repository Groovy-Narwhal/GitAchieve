var orgRouter = require('express').Router();
var orgController = require('../controllers/orgController.js');
var pullRequestController = require('../controllers/pullRequestController.js');

// the following routes start from /api/v1/orgs
orgRouter.route('/:id/orgs')
  .patch(orgController.retrieveOrgs);

orgRouter.route('/:id/pullrequests')
  .patch(pullRequestController.retrievePullRequests);

orgRouter.route('/:username/orgs')
  .get(orgController.retrieveAllOrgsForUser);

orgRouter.route('/:id/pullrequests')
  .get(pullRequestController.retrieveAllPRSForUser);

module.exports = orgRouter;
