const routes = require('express').Router();
const passport = require('passport');
const logger = require('../logger')('users_route');
const usersController = require('../controllers/users');


routes.get('/', usersController.index);
routes.post('/', usersController.create);
routes.get('/:userId', usersController.show);
routes.put('/:userId', usersController.update);
routes.delete('/:userId', usersController.destroy);

module.exports = routes;