const mongoose = require('mongoose');
const StepTemplateSchema = require('./schemas/stepTemplate');

//Exporting our model
const StepTemplateModel = mongoose.model('StepTemplate', StepTemplateSchema);
module.exports = StepModel;