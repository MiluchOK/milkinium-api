const routes = require('express').Router({mergeParams: true});
const logger = require('../logger')('cases_route');
const casesController = require('../controllers/cases');


routes.get('/:caseId', casesController.show);
routes.delete('/:caseId', casesController.destroy);
routes.put('/:caseId', casesController.update);

module.exports = routes;