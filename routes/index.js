const routes = require('express').Router();
const users = require('./users');
const runRoutes = require('./runs');
const projects = require('./projects');
const validate = require('express-validation');
const roots = require('./roots');
const auth = require('./auth');
const logger = require('../logger')('routes_index');
const caseValidator = require('../validators/cases');
const casesController = require('../controllers/cases');
const runsController = require('../controllers/runs');

logger('debug', "In routes.");
routes.use('/', roots);
routes.use('/', auth);
routes.use('/users', users);
routes.use('/projects', projects);
routes.get('/projects/:projectId/cases/:caseId', validate(caseValidator.getCase), casesController.show);
routes.put('/cases/:projectId/:caseId', casesController.update);
routes.delete('/cases/:caseId', casesController.destroy);

// Runs
routes.get('/projects/:projectId/runs', runsController.index);
routes.post('/projects/:projectId/runs', runsController.create);
routes.use('/runs', runRoutes);

module.exports = routes;