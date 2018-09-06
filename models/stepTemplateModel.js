const mongoose = require('mongoose');
const StepTemplateSchema = require('./schemas/stepTemplateSchema');

StepTemplateSchema.statics.createRandom = function(args){
    let randomData = {
        title: faker.finance.accountName()
    }
    randomData = Object.assign(randomData, args)
    return this.create(randomData)
}

//Exporting our model
const StepTemplateModel = mongoose.model('StepTemplate', StepTemplateSchema);
module.exports = StepTemplateModel;