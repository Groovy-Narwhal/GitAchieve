const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// GET at /api/v1/users/orgs/:id/pullrequsts
exports.retrieveBranches = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
};
