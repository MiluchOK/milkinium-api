const routes = require('express').Router({mergeParams: true});
const logger = require('../logger')('cases_route');
const casesController = require('../controllers/cases');


routes.get('/', casesController.index);
routes.post('/', casesController.create);

module.exports = routes;