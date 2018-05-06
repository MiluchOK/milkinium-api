require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authenticate');
const logger = require('./logger')('server_log');

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use((auth.authMid).unless({path: ['/authenticate']}));
app.use('/', routes);
app.use(errorHandler);

module.exports = app;