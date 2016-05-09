const orgController = require('../controllers/orgController.js');

module.exports = app => {
  app.get('/github/:username/orgs', orgController.retrieveAllOrgsForUser);
}
