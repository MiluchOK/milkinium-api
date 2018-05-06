const routes = require('express').Router();
const validate = require('express-validation');
const logger = require('../logger')('auth_route');
const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

routes.post('/authenticate', validate(authValidator.authenticate), authController.issueToken);
routes.get('/authenticate', authController.refreshToken);
routes.get('/whoami', authController.whoAmI);

module.exports = routes;