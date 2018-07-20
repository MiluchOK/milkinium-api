const Promise = require('bluebird');
const mongoose = require('mongoose');
const faker = require('faker');
const toJson = require('./toJson');
const logger = require('../logger')('projects_model');
const Run = require('./runs');
const Case = require('./cases');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
        toJSON: toJson,
        id: true
});

ProjectSchema.virtual('cases', {
    ref: 'Case',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

ProjectSchema.statics.createRandom = function(){
    randomData = {
        name: faker.internet.userName()
    }
    return ProjectModel(randomData).save()
}

ProjectSchema.methods.createRun = function(runData){
    return Run.create(Object.assign(runData, {project: this._id}))
}

ProjectSchema.methods.createCase = function(caseData){
    return Case.create(Object.assign(caseData, {project: this._id}))
}

ProjectSchema.pre('findOne', function() {
    this.populate('cases');
  });

//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;