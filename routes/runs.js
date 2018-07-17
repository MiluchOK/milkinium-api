const routes = require('express').Router();
const runsController = require('../controllers/runs');


routes.get('/:runId', runsController.show);
routes.get('/:runId/tests', runsController.listTests);
routes.post('/:runId/tests', runsController.addCase);

module.exports = routes;