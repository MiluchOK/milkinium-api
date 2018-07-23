const routes = require('express').Router();
const logger = require('../logger')('cases_route');
const projectsController = require('../controllers/projects');


routes.get('/', projectsController.index);
routes.post('/', projectsController.create);
routes.get('/:projectId', projectsController.show);
routes.put('/:projectId', projectsController.update);
routes.delete('/:projectId', projectsController.destroy);

module.exports = routes;