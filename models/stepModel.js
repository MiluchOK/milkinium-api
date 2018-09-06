const mongoose = require('mongoose');
const StepSchema = require('./schemas/stepSchema');

//Exporting our model
const StepModel = mongoose.model('Step', StepSchema);
module.exports = StepModel;