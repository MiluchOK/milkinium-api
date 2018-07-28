var Joi = require('joi');

module.exports = {
    addCase: {
        body: {
            cases: Joi.array().min(1).unique().required()
        }
    }
}