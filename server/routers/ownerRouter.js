const ownerRouter = require('express').Router();
const statController = require('./../controllers/statController.js');

// the following routes start from /api/v1/owner

ownerRouter.route('/:id/stats')
  // .get(statController.retrieveStats)
  // .post(statController.addStats)
  .patch(statController.updateStats);

module.exports = ownerRouter;
