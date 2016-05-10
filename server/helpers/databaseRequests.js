const orgController = require('../controllers/orgController.js');
const pullRequestController = require('../controllers/pullRequestController');

module.exports = app => {
  app.get('/github/:username/orgs', orgController.retrieveAllOrgsForUser);
  app.get('/github/:username/pullrequests', pullRequestController.retrieveAllPRSForUser);
}
