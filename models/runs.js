const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('runs_model');
const Schema = mongoose.Schema;
const Case = require('./cases');
const toJson = require('./toJson')

let RunSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
}, {
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret, options){ 
                delete ret._id;
                delete ret.__v;
                if(ret.tests == null){
                    ret.tests = []
                }
                return ret;
            },
        },
        id: true
});

RunSchema.virtual('tests', {
    ref: 'Test',
    localField: '_id',
    foreignField: 'run',
    justOne: false
});

RunSchema.statics.createRandom = function(args){
    randomData = {
        title: faker.internet.userName()
    }
    randomData = Object.assign(randomData, args)
    return RunModel(randomData).save()
}

RunSchema.methods.getTests = function(){
    return this.tests;
}

RunSchema.methods.addCase = function(caseId){
    return Case.findById(caseId)
    .then(caze => {
        return caze.createTest(this._id)
    })
}


RunSchema.pre('findOne', function() {
    this.populate('tests');
});

//Exporting our model
const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunModel;