const routes = require('express').Router();
const runsController = require('../controllers/runs');


routes.get('/:runId', runsController.show);

module.exports = routes;