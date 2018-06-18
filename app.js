require('dotenv').config();
const express = require('express');
const req = require('require-yml')
const morgan = require('morgan');
const v1 = require('express').Router();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = req('./swagger.yaml');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authenticate');
const logger = require('./logger')('app_log');

const app = express();

v1.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
v1.use(bodyParser.json());
v1.use(morgan('tiny'));
v1.use((auth.authMid).unless({path: ['/authenticate']}));
v1.use('/', routes);
v1.use(errorHandler);

app.use('/v1', v1)

module.exports = app;