require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const dbConnect = require('./config/db_connect');
const logger = require('./logger')('server_log');
const Promise = require('bluebird');
const seeds = require('seed-mongoose');
mongoose.Promise = require('bluebird');
const port = process.env.PORT || 5000;


const app = require('./app');

dbConnect.connect(config.db_host)
.then(() => {
    logger('info', 'Connected to database.');
    return new Promise(function(resolve, reject){
        const server = app.listen(port, () => { resolve(server) })
    })
})
.then((server) => {
    // Seed the DB
    logger('info', 'Seeding the DB.');
    return Promise.promisify(seeds)({mongoose: mongoose, logger:console,})
})
.then(data => {
    logger('info', 'Got the database seeded. ' + data)
})
.then(() => {
    logger('info', 'Server is running on port: ' + port)
})
.catch((err) => {
    logger('error', err.toString())
});
