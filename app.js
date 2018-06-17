require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authenticate');
const logger = require('./logger')('app_log');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use((auth.authMid).unless({path: ['/authenticate']}));
app.use('/', routes);
app.use(errorHandler);

module.exports = app;