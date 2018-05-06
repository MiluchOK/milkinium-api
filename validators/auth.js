const Joi = require('joi');
const logger = require('../logger')('auth_validator');

// GET list of all users.
exports.authenticate = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
};