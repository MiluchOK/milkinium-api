const mongoose = require('mongoose');
const CaseSchema = require('./schemas/caseSchema')

//Exporting our model
const CaseModel = mongoose.model('Case', CaseSchema);
module.exports = CaseModel;