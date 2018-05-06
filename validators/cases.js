const Joi = require('joi');
const logger = require('../logger')('cases_validator');

// GET list of all users.
exports.getCase = {
    params: {
        userId: Joi.string().required()
    }
};