const jwt = require('express-jwt');
const logger = require('../logger')('auth_middleware');

//Wrapping in a stupid object so it can be stabbed in the test
module.exports = {
    authMid: jwt({secret: process.env.JWT_SECRET})
};



