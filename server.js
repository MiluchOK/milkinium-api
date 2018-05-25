const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger')('server_log');
const dbConnect = require('./db').dbConnect;

const port = process.env.PORT || 5000;

// listen strats the server on the given port.
const start = (app, port) => {
    return app.listen(port, (server) => console.log(`Listening on port ${port}`));
};

// close destroys the server.
const stop = (server) => {
    server.close();
};

module.exports = {
    start: start,
    stop: stop
};

if(process.env.NODE_ENV !== 'test'){
    const app = require('./app');
    start(app, port);
    dbConnect(config);
}
else{
    logger('debug', "Skipping server start.")
}