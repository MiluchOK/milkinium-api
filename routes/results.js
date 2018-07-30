const routes = require('express').Router();
const resultsController = require('../controllers/results');


routes.get('/:testId/results', resultsController.index);
routes.post('/:testId/results', resultsController.create);

module.exports = routes;