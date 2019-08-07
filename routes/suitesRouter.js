const routes = require('express').Router({mergeParams: true});
const logger = require('../logger')('suites_route');
const suitesController = require('../controllers/suitesController');


routes.get('/:suiteId', suitesController.show);
routes.delete('/:suiteId', suitesController.destroy);
routes.put('/:suiteId', suitesController.update);

module.exports = routes;
