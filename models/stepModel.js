const mongoose = require('mongoose');
const StepSchema = require('./schemas/stepSchema');

StepSchema.statics.createRandom = function(args){
    let randomData = {
        title: faker.finance.accountName()
    }
    randomData = Object.assign(randomData, args)
    return this.create(randomData)
}

//Exporting our model
const StepModel = mongoose.model('Step', StepSchema);
module.exports = StepModel;