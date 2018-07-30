const mongoose = require('mongoose');
const StatusSchema = require('./schemas/statusSchema')


//Exporting our model
const StatusModel = mongoose.model('Status', StatusSchema);
module.exports = StatusModel;