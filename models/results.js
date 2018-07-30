const mongoose = require('mongoose');
const ResultSchema = require('./schemas/resultsSchema');

//Exporting our model
const ResultModel = mongoose.model('Result', ResultSchema);
module.exports = ResultModel;