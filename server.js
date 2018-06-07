const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger')('server_log');
const Promise = require('bluebird')
mongoose.Promise = require('bluebird');
const port = process.env.PORT || 5000;


const app = require('./app')

mongoose.connect(config.db_host)
.then(() => {
    logger('info', 'Connected to database.')
    return new Promise(function(resolve, reject){
        const server = app.listen(port, () => { resolve(server) })
    })
})
.then((server) => {
    logger('info', 'Server is running on port: ' + port)
})