const mongoose = require('mongoose');
const StepTemplateSchema = require('./schemas/stepTemplateSchema');

//Exporting our model
const StepTemplateModel = mongoose.model('StepTemplate', StepTemplateSchema);
module.exports = StepModel;