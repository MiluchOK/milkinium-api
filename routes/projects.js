const routes = require('express').Router();
const logger = require('../logger')('cases_route');
const projectsController = require('../controllers/projects');
const casesRouter = require('./cases');


routes.use('/:projectId/cases', casesRouter);
routes.get('/', projectsController.index);
routes.post('/', projectsController.create);
routes.get('/:projectId', projectsController.show);
routes.put('/:projectId', projectsController.update);
routes.delete('/:projectId', projectsController.destroy);

module.exports = routes;