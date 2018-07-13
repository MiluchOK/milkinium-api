const Promise = require('bluebird');
const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('projects_model');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret, options){ 
                delete ret._id;
                delete ret.__v
                return ret;
            },
        },
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

ProjectSchema.pre('findOne', function() {
    this.populate('cases');
  });

//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;