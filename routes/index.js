const routes = require('express').Router();
const users = require('./users');
const cases = require('./cases');
const projects = require('./projects');
const validate = require('express-validation');
const roots = require('./roots');
const auth = require('./auth');
const logger = require('../logger')('routes_index');
const caseValidator = require('../validators/cases');
const casesController = require('../controllers/cases');

logger('debug', "In routes.");
routes.use('/', roots);
routes.use('/', auth);
routes.use('/users', users);
routes.use('/projects', projects);
routes.get('/cases/:caseId', validate(caseValidator.getCase), casesController.show);
routes.put('/cases/:caseId', casesController.update);
routes.delete('/cases/:caseId', casesController.destroy);

module.exports = routes;