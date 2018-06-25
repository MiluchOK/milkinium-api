const Promise = require('bluebird');
const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('projects_model');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
  foreignField: 'project'
});

ProjectSchema.statics.findWithCases = function(id){
    const self = this;
    logger('debug', "Searching for cases with project id: " + id)
    return new Promise(function(resolve, reject){
        self.findById(id)
            .populate('cases')
            .exec()
            .then((data) => {
                logger('debug', "Got cases for project with id: " + id + ". The data: " + data)
                resolve(data);
            })
            .catch((err) => {
                logger('error', err)
                reject(err);
            })
    })
};

ProjectSchema.statics.createRandom = function(){
    randomData = {
        name: faker.internet.userName()
    }
    return ProjectModel(randomData).save()
}

//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;