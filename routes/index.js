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
const suitesController = require('../controllers/suitesController');
const resultsRouter = require('./results');
const casesRouter = require('./cases');
const suitesRouter = require('./suitesRouter');

logger('debug', "In routes.");
routes.use('/', roots);
routes.use('/', auth);
// Users
routes.use('/users', users);
// Projects
routes.use('/projects', projects);
// Cases
routes.use('/cases', casesRouter);
routes.get('/projects/:projectId/cases', casesController.index);
routes.post('/projects/:projectId/cases', casesController.create);

// Runs
routes.get('/projects/:projectId/runs', runsController.index);
routes.post('/projects/:projectId/runs', runsController.create);
routes.use('/runs', runRoutes);

// Suites
routes.use('/suites', suitesRouter)
routes.get('/projects/:projectId/suites', suitesController.index)
routes.post('/projects/:projectId/suites', suitesController.create)

// Results
routes.use('/tests', resultsRouter);

module.exports = routes;