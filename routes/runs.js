const routes = require('express').Router();
const routesController = require('../controllers/routes');


routes.get('/:runId', routesController.show);

module.exports = routes;